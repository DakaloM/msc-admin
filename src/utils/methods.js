import { ToastContainer, toast } from 'react-toastify';

export const formatDate = (x) => {
  const date = new Date(x)
  return date.getDate() + " " + date.toLocaleString('default', {month: 'long'}) + " " + date.getFullYear()
}

export const clearInputs = () => {
  const list = document.querySelectorAll('.input');
  for (let i = 0; i < list.length; i++) {
    list[i].value = '';
  }
}

export const notify = (completeType, message) => {
    if(completeType === "success"){
      
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    } else if(completeType === "error"){
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
    
  };