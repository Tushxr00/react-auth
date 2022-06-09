import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth- context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const navigation = useNavigate();
  const authCtx = useContext(AuthContext);

  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    console.log(enteredNewPassword);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAmAa2s7k7-0jkCPIPMHxIY0hfqcUoAEkI",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        navigation("/");
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
