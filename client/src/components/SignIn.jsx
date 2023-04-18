import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import apiServiceJWT from "../ApiServiceJWT";
import auth from "../utils/auth";
import { setAuthentication } from "../features/authentication/authenticationSlice";
// import { OAuth2Client } from "google-auth-library";
import Header from "./Header";
import { useDispatch } from "react-redux";
// const http = require("http");
// const url = require("url");
// const open = require("open");
// const destroyer = require("server-destroy");
// const keys = require("../auth2google.json");

const initialState = {
  email: "",
  password: "",
};

const SignIn = ({ toggleSignUp }) => {
  const [state, setState] = useState(initialState);

  // const isAuthenticated = useSelector(
  //   (state) => state.authentication.isAuthenticated
  // );

  const dispatch = useDispatch();

  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Check the session branch to see how to handle redirects

    e.preventDefault();
    // Add logic to send a request to API service /login

    // This sets isAuthenticated = true and redirects to profile
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    // console.log(formJson);
    const data = await apiServiceJWT.login(formJson);
    localStorage.setItem("accessToken", data.accessToken);
    Cookies.set("accessToken", data.accessToken);
    // props.setIsAuthenticated(true);
    dispatch(setAuthentication(true));
    auth.login(() => navigate("/"));
  };

  const validateForm = () => {
    return !state.email || !state.password;
  };

  // const auth = new GoogleAuth({
  //   client_id:
  //     "246635221660-u6e89jpsvh0p5kavicmf3k05op0rn9fd.apps.googleusercontent.com",
  //   scope: "email",
  // });

  // function handleSignIn() {
  //   auth
  //     .signIn()
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // useEffect(async () => {
  //   const oAuth2Client = await getAuthenticatedClient();
  //   // Make a simple request to the People API using our pre-authenticated client. The `request()` method
  //   // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  //   const url = "https://people.googleapis.com/v1/people/me?personFields=names";
  //   const res = await oAuth2Client.request({ url });
  //   console.log(res.data);

  //   // After acquiring an access_token, you may want to check on the audience, expiration,
  //   // or original scopes requested.  You can do that with the `getTokenInfo` method.
  //   const tokenInfo = await oAuth2Client.getTokenInfo(
  //     oAuth2Client.credentials.access_token
  //   );
  //   console.log(tokenInfo);
  // }, []);

  // function getAuthenticatedClient() {
  //   return new Promise((resolve, reject) => {
  //     // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
  //     // which should be downloaded from the Google Developers Console.
  //     const oAuth2Client = new OAuth2Client(
  //       keys.web.client_id,
  //       keys.web.client_secret,
  //       keys.web.redirect_uris[0]
  //     );

  //     // Generate the url that will be used for the consent dialog.
  //     const authorizeUrl = oAuth2Client.generateAuthUrl({
  //       access_type: "offline",
  //       scope: "https://www.googleapis.com/auth/userinfo.profile",
  //     });

  //     // Open an http server to accept the oauth callback. In this simple example, the
  //     // only request to our webserver is to /oauth2callback?code=<code>
  //     const server = http
  //       .createServer(async (req, res) => {
  //         try {
  //           if (req.url.indexOf("/oauth2callback") > -1) {
  //             // acquire the code from the querystring, and close the web server.
  //             const qs = new url.URL(req.url, "http://localhost:3000")
  //               .searchParams;
  //             const code = qs.get("code");
  //             console.log(`Code is ${code}`);
  //             res.end(
  //               "Authentication successful! Please return to the console."
  //             );
  //             server.destroy();

  //             // Now that we have the code, use that to acquire tokens.
  //             const r = await oAuth2Client.getToken(code);
  //             // Make sure to set the credentials on the OAuth2 client.
  //             oAuth2Client.setCredentials(r.tokens);
  //             console.info("Tokens acquired.");
  //             resolve(oAuth2Client);
  //           }
  //         } catch (e) {
  //           reject(e);
  //         }
  //       })
  //       .listen(3000, () => {
  //         // open the browser to the authorize url to start the workflow
  //         open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
  //       });
  //     destroyer(server);
  //   });
  // }

  return (
    <div className="signInPage">
      <Header />
      <div className="signIn">
        <form action="#" className="signIn__form form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={state.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
          />
          <button type="submit" className="button" disabled={validateForm()}>
            Sign In
          </button>
          {/* <button onClick={handleSignIn}>Sign in with Google</button> */}
        </form>
        <div className="toggler">
          Don't have an account?{" "}
          <button className="button button-toggler" onClick={toggleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
