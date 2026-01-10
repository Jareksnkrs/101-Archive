// api/entreno.js
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    const apiKey = process.env.HEVY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Falta HEVY_API_KEY" });

    if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

    const action = (req.query.action || "").toLowerCase();
    if (action !== "seed_week") {
      return res.status(400).json({ error: "Usa ?action=seed_week" });
    }

    const force = req.query.force === "1";
    const baseStart = new Date();
    const minutesBetweenWorkouts = 5;

    // Duración por tipo de entreno (en minutos)
    const durations = {
      "Lunes PUSH: Pecho, Hombros, Tríceps": 75,
      "Martes PULL: Espalda, Bíceps": 75,
      "Miércoles LEG: Piernas, Core": 90,
      "Jueves PUSH (Variante): Pecho, Hombros, Tríceps": 70,
      "Viernes PULL (Variante): Espalda, Bíceps": 70,
      "Sábado LEG (Variante): Piernas, Core": 85,
      "Domingo FULL BODY: Circuito": 60
    };

    const workoutsToCreate = [
      {
        title: "Lunes PUSH: Pecho, Hombros, Tríceps",
        description: "Pecho + Hombros + Tríceps · Descanso 90s · Tempo 3-1-3",
        exercises: [
          { exercise_template_id: "3601968B", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Bench Press (Dumbbell)
          { exercise_template_id: "18487FA7", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Decline Bench Press (Dumbbell)
          { exercise_template_id: "12017185", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Chest Fly (Dumbbell)
          { exercise_template_id: "A69FF221", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Arnold Press (Dumbbell)
          { exercise_template_id: "F21D5693", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Chest Supported Y Raise (Dumbbell)
          { exercise_template_id: "CD6DC8E5", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] }, // Bench Dip
          { exercise_template_id: "35B51B87", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] } // Bench Press - Close Grip (Barbell)
        ]
      },
      {
        title: "Martes PULL: Espalda, Bíceps",
        description: "Espalda + Bíceps · Descanso 90s · Tempo controlado",
        exercises: [
          { exercise_template_id: "23E92538", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bent Over Row (Dumbbell)
          { exercise_template_id: "914F3A96", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Chest Supported Incline Row (Dumbbell)
          { exercise_template_id: "55E6546F", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bent Over Row (Barbell)
          { exercise_template_id: "B582299E", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Chest Supported Reverse Fly (Dumbbell)
          { exercise_template_id: "A5AC6449", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bicep Curl (Barbell)
          { exercise_template_id: "37FCC2BB", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Bicep Curl (Dumbbell)
          { exercise_template_id: "724CDE60", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] } // Concentration Curl
        ]
      },
      {
        title: "Miércoles LEG: Piernas, Core",
        description: "Piernas + Core · Reps altas · Descanso 60–90s",
        exercises: [
          { exercise_template_id: "5F4E6DD3", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Deadlift (Dumbbell)
          { exercise_template_id: "38FC1AB9", sets: [{ type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }] }, // Box Squat (Barbell)
          { exercise_template_id: "D39EC9EB", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Curtsy Lunge (Dumbbell)
          { exercise_template_id: "C6272009", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Deadlift (Barbell)
          { exercise_template_id: "91237BDD", sets: [{ type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }] }, // Calf Press (Machine)
          { exercise_template_id: "CC55119B", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] } // Cable Core Palloff Press
        ]
      },
      {
        title: "Jueves PUSH (Variante): Pecho, Hombros, Tríceps",
        description: "Variante · Más declinado + tríceps · Descanso 90s",
        exercises: [
          { exercise_template_id: "3601968B", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Bench Press (Dumbbell)
          { exercise_template_id: "18487FA7", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Decline Bench Press (Dumbbell)
          { exercise_template_id: "12017185", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Chest Fly (Dumbbell)
          { exercise_template_id: "A69FF221", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Arnold Press (Dumbbell)
          { exercise_template_id: "35B51B87", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Bench Press - Close Grip (Barbell)
          { exercise_template_id: "CD6DC8E5", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] } // Bench Dip
        ]
      },
      {
        title: "Viernes PULL (Variante): Espalda, Bíceps",
        description: "Variante · Más barra + curl variado · Descanso 90s",
        exercises: [
          { exercise_template_id: "55E6546F", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bent Over Row (Barbell)
          { exercise_template_id: "23E92538", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bent Over Row (Dumbbell)
          { exercise_template_id: "914F3A96", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Chest Supported Incline Row (Dumbbell)
          { exercise_template_id: "B582299E", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Chest Supported Reverse Fly (Dumbbell)
          { exercise_template_id: "3BC06AD3", sets: [{ type: "normal", weight_kg: 10, reps: 21 }, { type: "normal", weight_kg: 10, reps: 21 }, { type: "normal", weight_kg: 10, reps: 21 }] }, // 21s Bicep Curl
          { exercise_template_id: "37FCC2BB", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Bicep Curl (Dumbbell)
          { exercise_template_id: "32C4D4A2", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] } // Cross Body Hammer Curl
        ]
      },
      {
        title: "Sábado LEG (Variante): Piernas, Core",
        description: "Variante · Más volumen en bisagra · Descanso 60–90s",
        exercises: [
          { exercise_template_id: "5F4E6DD3", sets: [{ type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }] }, // Deadlift (Dumbbell)
          { exercise_template_id: "C6272009", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Deadlift (Barbell)
          { exercise_template_id: "38FC1AB9", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Box Squat (Barbell)
          { exercise_template_id: "D39EC9EB", sets: [{ type: "normal", weight_kg: 10, reps: 14 }, { type: "normal", weight_kg: 10, reps: 14 }, { type: "normal", weight_kg: 10, reps: 14 }] }, // Curtsy Lunge (Dumbbell)
          { exercise_template_id: "91237BDD", sets: [{ type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }, { type: "normal", weight_kg: 10, reps: 20 }] }, // Calf Press (Machine)
          { exercise_template_id: "CC55119B", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] } // Cable Core Palloff Press
        ]
      },
      {
        title: "Domingo FULL BODY: Circuito",
        description: "Full body · 3 rondas · Descanso mínimo",
        exercises: [
          { exercise_template_id: "3601968B", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bench Press (Dumbbell)
          { exercise_template_id: "23E92538", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bent Over Row (Dumbbell)
          { exercise_template_id: "A69FF221", sets: [{ type: "normal", weight_kg: 10, reps: 10 }, { type: "normal", weight_kg: 10, reps: 10 }, { type: "normal", weight_kg: 10, reps: 10 }] }, // Arnold Press (Dumbbell)
          { exercise_template_id: "5F4E6DD3", sets: [{ type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }, { type: "normal", weight_kg: 10, reps: 15 }] }, // Deadlift (Dumbbell)
          { exercise_template_id: "A5AC6449", sets: [{ type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }, { type: "normal", weight_kg: 10, reps: 12 }] }, // Bicep Curl (Barbell)
          { exercise_template_id: "CD6DC8E5", sets: [{ type: "normal", reps: 12 }, { type: "normal", reps: 12 }, { type: "normal", reps: 12 }] } // Bench Dip
        ]
      }
    ];

    const results = [];

    for (let i = 0; i < workoutsToCreate.length; i++) {
      const w = workoutsToCreate[i];

      const start = new Date(baseStart.getTime() + i * minutesBetweenWorkouts * 60 * 1000);
      const duration = durations[w.title] || 75;
      const end = new Date(start.getTime() + duration * 60 * 1000);

      const payload = {
        workout: {
          title: w.title,
          description: w.description,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          is_private: true,
          exercises: w.exercises
        }
      };

      const r = await fetch("https://api.hevyapp.com/v1/workouts", {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await r.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

      results.push({
        index: i + 1,
        title: w.title,
        status: r.status,
        success: r.ok,
        hevy: parsed
      });

      if (!force && !r.ok) {
        return res.status(200).json({
          success: false,
          error: "Se paró al primer fallo. Usa ?force=1 para que intente todos.",
          results
        });
      }
    }

    return res.status(200).json({ success: true, created: results.length, results });
  } catch (e) {
    return res.status(500).json({ error: "Crash", message: e.message });
  }
}
