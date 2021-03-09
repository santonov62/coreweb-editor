import {State} from "./State";
import {Form} from "./Form";

const formState = new Form();
export const state = new State({formState});
