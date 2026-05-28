export const getlanguagebyid = (language) => {
    const mapper = {
        "cpp": 54,     
        "java": 62,    // Java (OpenJDK 13.0.1)
        "javascript": 63, // Node.js (12.14.0)
        "c++": 54,     // C++ (GCC 9.4.0)
    };

    return mapper[language.toLowerCase()] || null;
};