export const SeparadorDecimal=(num:any)=>{
    try {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

    } catch (error) {
        // console.log('error en SeparadorDecimal: ',error)
        return '0'
    }
         
}
export const EliminarComas = (str: any) => {
    try {
      return str.replace(/,/g, ''); // Remover todas las comas
    } catch (error) {
      console.log('error en EliminarComas: ', error);
      return '0';
    }
  };