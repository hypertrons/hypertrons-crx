import { updateInformation } from '../mock/background.data';
const url_update="";

export const getUpdateInfor = async () => {
  // const response = await fetch(url_update);
  // return await response.json();
  return updateInformation;
}