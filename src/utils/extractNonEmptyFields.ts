const  extractNonEmptyFields =<T>(requestBody: any, model: any): Partial<T> =>{
    const notEmptyData: Partial<T> = {};
  
    for (const key of Object.keys(model.schema.paths)) {
      if (requestBody[key]) {
        notEmptyData[key] = requestBody[key];
      }
    }
  
    return notEmptyData;
  }

export default extractNonEmptyFields;