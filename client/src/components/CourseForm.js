import React from 'react';

 export default (props) => {
   const {
     cancel,
     errors,
     submit,
     submitButtonText,
     elements,
   } = props;

   function handleSubmit(event) {
     event.preventDefault();
     submit();
   }

   function handleCancel(event) {
     event.preventDefault();
     cancel();
   }

    return (                   //CourseForm used to Create course
     <div className="bounds course--detail">
       <h1>Create Course</h1>        
       <div>
         <ErrorsDisplay errors={errors} />
         <form onSubmit={handleSubmit}>
         {elements()}
           <div className="grid-100 pad-bottom">
             <button className="button" type="submit">{submitButtonText}</button>
             <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
           </div>
         </form>
       </div>
     </div>
   );
 }

 function ErrorsDisplay({ errors }) {
   let errorsDisplay = null;

   if (errors.length) {
     errorsDisplay = (
       <div>
         <h2 className="validation--errors--label">Validation errors</h2>
         <div className="validation-errors">
           <ul>
             {errors.map((error, i) => <li key={i}>{error.message}</li>)}
           </ul>
         </div>
       </div>
     );
   }

   return errorsDisplay;
 }