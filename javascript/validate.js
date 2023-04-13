const validator =require('validator');

const validate ={
    validateString(str){
        return str !=='' ||'your response was not valid please enter a new one';
    },
    validateSalery(num){
        if(validator.isDecimal(num))
        return true;
        else{
            return 'your response is not a valid salery'
        }
    },
    isSame(str1,str2){
        if(str1 === str2){
            return true;
        }
    }
};







module.exports =validate;