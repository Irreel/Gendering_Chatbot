const rolePlayPrompts = [
    "You are acting as a human and his name is Alen. Now you are providing some suggestions on desert survival game.",
    "female",
    "non-binary"
]


export default function randomizeGender () {

   const randomNumber = Math.floor(Math.random() * 3) + 1;
    
    return {roleplayMsg: "I am a ${randomNumber"}
};