import { customtags, gt, ls, lslash, methodVariables, replacerIdentifiers } from "./constants";
import { writePattern } from "./patterns";

const rand = `${Math.random()}`.replace('.','');

export function getReplacer(name:keyof typeof replacerIdentifiers){
    return `${replacerIdentifiers[name]}${rand}_`;
}

export function write(code:string){
    let writes = code.match(writePattern);
    if(!writes) return code;
    let word,length; 
    for(let i = 0; i <writes.length;i++){
        word = writes[i];
        length = word.length;
        word = word.replace(/\/\/[ ]+\\write[ ]+/,'');
        if(/(\s+\\n\s*\n\s*\S)$/.test(word)){
            code = code.replace(writes[i],word.split('\\n').join(''))
        }else{
            word = word.replace(/(\s*\n\s*\S)$/,'')
            code = code.replace(writes[i],`${word} ${writes[i][length-1]}`)
        }
       
    }
    return write(code);
}

export function RemoveToken(name:keyof typeof replacerIdentifiers,code:string,pattern:RegExp): {code:string}&{[k:string]:string[]} {
    let matches:any = code.match(pattern);
    
    const replacer = getReplacer(name);
    let i;
    if (matches) {
      switch (name) {
        case 'bluekeys':
          code = code.replace(pattern,replacer);
          break;
        case 'yellowkeys':
          for (i = 0; i < matches.length; i++){
            code = code.replace(methodVariables.init(matches[i]), `${replacer}${i}${replacer}`);
          }
          break;
        case 'customkeys':
          for (i = 0; i < matches.length; i++){
            code = code.replace(customtags.init(matches[i]), `${replacer}${i}${replacer}`);
          }
          break;
        default:
          for (let i = 0; i < matches.length; i++){
            code = code.replace(matches[i], `${replacer}${i}${replacer}`);
          }
          break;
      }
     
      if(name=='text'){
        matches = matches.join(replacer).replace(/<x-text>/gs,'').replace(/<\/x-text>/gs,'').split(replacer);
      }
    } else {
      matches = [];
    }
    
    const data = { code:code, [name]:matches };
    return data;
}

const replace = (original_str: string, search_str: string, replacer: string)=>{
  const index = original_str.indexOf(search_str);
  if(index>=0){
    const before = original_str.slice(0, index)||'';
    const after = original_str.slice(index + search_str.length)||'';
    return before+replacer+after
  }
  return original_str;
}

export function ReplaceToken(name:keyof typeof replacerIdentifiers,classname:string, code:string, tokens:string[]) {
    const replacer = getReplacer(name);
    if(name==='bluekeys'){
      for (var i = 0; i < tokens.length; i++) {
        code = code.replace(replacer,`${ls}span class="xmk-${classname}"${gt}${tokens[i]}${lslash}span${gt}`);
      }
    }else{
      switch (name) {
        case 'yellowkeys':
        case 'customkeys':
          for (let i = 0; i < tokens.length; i++){
            code = code.replace(RegExp(`${replacer}${i}${replacer}`,'gs'),`${ls}span class="xmk-${classname}"${gt}${tokens[i]}${lslash}span${gt}`);
          }
          
          break;
        default:
          for (let i = 0; i < tokens.length; i++){
            code = code.replace(`${replacer}${i}${replacer}`,`${ls}span class="xmk-${classname}"${gt}${tokens[i]}${lslash}span${gt}`);
          }

          break;
      }
      
    }
    return code;
}
