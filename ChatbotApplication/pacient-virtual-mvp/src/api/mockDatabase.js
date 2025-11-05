// This file simulates a database and the AI logic
// Data is hardcoded, as per the assignment requirements [cite: image_2a0799.png]

// List of scenarios (CRUD: Read)
export const patientScenarios = [
  {
    id: 1,
    title: "Pain in the lower left molar",
    initialMessage: "Hello, I've had a toothache in my lower left molar for about two days...",
    // Final step: choosing the diagnosis
    diagnoses: [
      "Reversible Pulpitis",
      "Symptomatic Irreversible Pulpitis",
      "Symptomatic Apical Periodontitis",
      "Gingivitis"
    ],
    correctDiagnosis: "Symptomatic Irreversible Pulpitis"
  },
  {
    id: 2,
    title: "Fallen filling",
    initialMessage: "Hello, I think a filling fell out, can you help me?",
    diagnoses: [
      "Secondary Caries",
      "Tooth Fracture",
      "Healthy tooth, just needs a new filling",
      "Dental Abscess"
    ],
    correctDiagnosis: "Healthy tooth, just needs a new filling"
  },
  {
    id: 3,
    title: "Pain on touch and biting",
    initialMessage: "Hello, a tooth hurts only when I touch it or when I bite down hard.",
    diagnoses: [
      "Irreversible Pulpitis",
      "Occlusal Trauma",
      "Chronic Apical Periodontitis",
      "Symptomatic Apical Periodontitis"
    ],
    correctDiagnosis: "Symptomatic Apical Periodontitis"
  }
];

// Helper function to find a scenario by ID
export const getScenarioById = (id) => {
  const scenarioId = parseInt(id, 10); 
  return patientScenarios.find(s => s.id === scenarioId);
};

// Mocked AI Logic (Mocked Logic)
// Returns a hardcoded response based on the input [cite: image_2a0799.png]
export const getMockedResponse = (scenarioId, userInput) => {
  const lowerInput = userInput.toLowerCase();
  const id = parseInt(scenarioId, 10);

  // --- Logic for Scenario 1 (Irreversible Pulpitis) ---
  if (id === 1) {
    if (lowerInput.includes("when does it hurt") || lowerInput.includes("eat")) {
      return "Sometimes it hurts when I eat, other times when I touch the tooth... it also happens when I clench my teeth hard.";
    }
    if (lowerInput.includes("cold")) {
      return "Yes, it hurts a lot with cold things, and the pain lingers for a few minutes.";
    }
    if (lowerInput.includes("hot")) {
      return "No, hot things don't bother me much. It's just the cold.";
    }
    if (lowerInput.includes("night")) {
      return "Yes! It woke me up last night, and I had to take a painkiller.";
    }
  }

  // --- Logic for Scenario 2 (Fallen filling) ---
  if (id === 2) {
    if (lowerInput.includes("hurt")) {
      return "It doesn't hurt at all, but it bothers my tongue, and I feel a hole.";
    }
    if (lowerInput.includes("when") || lowerInput.includes("fall out")) {
      return "It fell out yesterday when I was eating bread.";
    }
    if (lowerInput.includes("cold") || lowerInput.includes("hot")) {
      return "No, I don't feel any pain from cold or hot."
    }
  }

  // --- Logic for Scenario 3 (Apical Periodontitis) ---
  if (id === 3) {
     if (lowerInput.includes("cold") || lowerInput.includes("hot")) {
      return "No, it doesn't bother me at all with cold or hot.";
    }
     if (lowerInput.includes("eat") || lowerInput.includes("chew")) {
      return "Yes, when I chew on that side, I feel discomfort. That's why I'm trying to eat on the other side.";
    }
     if (lowerInput.includes("swollen") || lowerInput.includes("swelling")) {
        return "No, my face isn't swollen, but I feel like that tooth is 'taller' than the others.";
     }
  }

  // Default response if no rule matches
  return "I'm not sure I understand. Can you please rephrase the question?";
};