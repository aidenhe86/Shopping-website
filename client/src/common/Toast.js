import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toast(msg, type) {
  if (type === "success") {
    toast.success(msg, {
      position: toast.POSITION.TOP_CENTER,
    });
  } else if (type === "error") {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER,
    });
  } else {
    toast(msg, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export default Toast;
