export const INITIAL_STATE = {
    title: "",
    desc: "",
    category: "",
    budget: null,
    isBudgetNegotiable: false,
    location: "",
    deadline: null,
    skills: [],
    languageVisibility: { uk: true, en: false },
};

export const jobReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_INPUT":
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        case "ADD_SKILL":
            return {
                ...state,
                skills: [...state.skills, action.payload],
            };
        case "REMOVE_SKILL":
            return {
                ...state,
                skills: state.skills.filter((skill) => skill !== action.payload),
            };
        case "TOGGLE_LANGUAGE_VISIBILITY":
            return {
                ...state,
                languageVisibility: {
                    uk: action.payload.language === "uk",
                    en: action.payload.language === "en",
                },
            };
        default:
            return state;
    }
};