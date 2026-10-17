import {freshState,transition as t} from '../js/state.js';
export function prepared(events=[],cover='money'){let s=freshState();for(const e of events)s=t(s,Array.isArray(e)?e[0]:e,Array.isArray(e)?e[1]:undefined);return s;}
export const route=['start','bounty','raid',['cover','money'],'camera','alex','anya','alisa','arisha','photo','hat','equip','reunion','letter'];
export function through(event){return prepared(route.slice(0,route.findIndex(e=>(Array.isArray(e)?e[0]:e)===event)+1));}

