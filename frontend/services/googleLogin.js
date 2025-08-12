import { useGoogleLogin } from "@react-oauth/google";
import { registerThroughGoogle } from "./user";
export function useGoogleAuthLogin(onSuccessCallBack, onErrorCallBack) {
  return useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await registerThroughGoogle({
          token: tokenResponse.access_token,
        });
        if (onSuccessCallBack) {
          console.log(res.data.user);
          onSuccessCallBack(res.data);
        }
      } catch (error) {
        console.log("google login failed", error);
        if (onErrorCallBack) {
          onErrorCallBack(error);
        } else {
          console.log(`something went wrong`);
        }
      }
    },
    onError: (err) => {
      console.error("Google OAuth Error:", err);
      if (onErrorCallBack) {
        onErrorCallBack(err);
      } else {
        alert("Something went wrong");
      }
    },
  });
}
