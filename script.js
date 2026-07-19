const PASSWORD = 'Pepodric';
const input = document.getElementById('pw-input');
const btn = document.getElementById('enter-btn');
const errMsg = document.getElementById('error-msg');
const lockScreen = document.getElementById('lock-screen');
const eyeBg = document.getElementById('eye-bg');

function tryUnlock() {
    if (input.value === PASSWORD) {
        lockScreen.classList.add('fade-out');
        eyeBg.classList.add('visible');
        setTimeout(() => { lockScreen.style.display = 'none'; }, 1100);
    } else {
        input.classList.add('error');
        errMsg.textContent = 'Incorrect password';
        setTimeout(() => {
            input.classList.remove('error');
            errMsg.textContent = '';
        }, 1200);
        input.value = '';
    }
}

btn.addEventListener('click', tryUnlock);
input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

// MOTOR WEBGL
(function() {
    const canvas = document.getElementById('eye-canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);

    function generateNoise(size) {
        const data = new Uint8Array(size * size * 4);
        function hash(x, y, s) {
            let n = x * 374761393 + y * 668265263 + s * 1274126177;
            n = Math.imul(n ^ (n >>> 13), 1274126177);
            return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
        }
        function noise(px, py, freq, seed) {
            const fx = (px / size) * freq, fy = (py / size) * freq;
            const ix = Math.floor(fx), iy = Math.floor(fy);
            const tx = fx - ix, ty = fy - iy;
            const w = freq | 0;
            const v00 = hash(((ix%w)+w)%w, ((iy%w)+w)%w, seed);
            const v10 = hash((((ix+1)%w)+w)%w, ((iy%w)+w)%w, seed);
            const v01 = hash(((ix%w)+w)%w, (((iy+1)%w)+w)%w, seed);
            const v11 = hash((((ix+1)%w)+w)%w, (((iy+1)%w)+w)%w, seed);
            return v00*(1-tx)*(1-ty)+v10*tx*(1-ty)+v01*(1-tx)*ty+v11*tx*ty;
        }
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let v = 0, amp = 0.4, totalAmp = 0;
                for (let o = 0; o < 8; o++) {
                    const f = 32 * (1 << o);
                    v += amp * noise(x, y, f, o * 31);
                    totalAmp += amp; amp *= 0.65;
                }
                v /= totalAmp;
                v = (v - 0.5) * 2.2 + 0.5;
                v = Math.max(0, Math.min(1, v));
                const val = Math.round(v * 255);
                const i = (y * size + x) * 4;
                data[i] = data[i+1] = data[i+2] = val; data[i+3] = 255;
            }
        }
        return data;
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, generateNoise(256));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    const vert = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

    const frag = `
        precision highp float;
        uniform float uTime;
        uniform vec3 uResolution;
        uniform sampler2D uNoiseTexture;
        uniform vec2 uMouse;
        void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
            uv /= 0.8;
            float ft = uTime * 1.0;
            float polarRadius = length(uv) * 2.0;
            float polarAngle = (2.0 * atan(uv.x, uv.y)) / 6.28 * 0.3;
            vec2 polarUv = vec2(polarRadius, polarAngle);
            vec4 noiseA = texture2D(uNoiseTexture, polarUv * vec2(0.2, 7.0) + vec2(-ft * 0.1, 0.0));
            vec4 noiseB = texture2D(uNoiseTexture, polarUv * vec2(0.3, 4.0) + vec2(-ft * 0.2, 0.0));
            vec4 noiseC = texture2D(uNoiseTexture, polarUv * vec2(0.1, 5.0) + vec2(-ft * 0.1, 0.0));
            float distanceMask = 1.0 - length(uv);
            float innerRing = clamp(-1.0 * ((distanceMask - 0.7) / 0.25), 0.0, 1.0);
            innerRing = (innerRing * distanceMask - 0.2) / 0.28;
            innerRing += noiseA.r - 0.5;
            innerRing = clamp(innerRing * 1.3, 0.0, 1.0);
            float outerRing = clamp(-1.0 * ((distanceMask - 0.5) / 0.2), 0.0, 1.0);
            outerRing = (outerRing * distanceMask - 0.1) / 0.38;
            outerRing += noiseC.r - 0.5;
            innerRing += clamp(outerRing * 1.3, 0.0, 1.0);
            float innerEye = (distanceMask - 0.2) * noiseB.r * 2.0;
            vec2 pupilOffset = uMouse * 0.12;
            float pupil = 1.0 - length((uv - pupilOffset) * vec2(9.0, 2.3));
            pupil = clamp(pupil * 0.6 / 0.35, 0.0, 1.0);
            float glow = pow(clamp((1.0 - length(uv * vec2(0.5, 1.5))) + 0.5, 0.0, 1.0) + noiseC.r - 0.5, 2.0) + distanceMask;
            glow = clamp(glow * 0.35, 0.0, 1.0) * pow(1.0 - distanceMask, 2.0) * 2.5;
            vec3 color = vec3(1.0) * 1.5 * clamp(max(innerRing + innerEye, glow) - pupil, 0.0, 3.0) + vec3(18.0/255.0, 15.0/255.0, 23.0/255.0);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('mousemove', e => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -(((e.clientY / window.innerHeight) * 2) - 1);
    });
    window.addEventListener('touchmove', e => {
        const t = e.touches[0];
        mouse.tx = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -(((t.clientY / window.innerHeight) * 2) - 1);
    }, { passive: true });

    function loop(t) {
        requestAnimationFrame(loop);
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), t * 0.001);
        gl.uniform3f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height, canvas.width/canvas.height);
        gl.uniform2f(gl.getUniformLocation(program, 'uMouse'), mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(loop);
})();
