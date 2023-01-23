export const baseRoute = "http://localhost:5000";

/*******************  user-routes *********************/

export const loginRoute = `${baseRoute}/api/auth/login`;
export const signupRoute = `${baseRoute}/api/auth/signup`;
export const getUserNamesRoute = `${baseRoute}/api/auth/get-usernames`;
export const setAvatarRoute = `${baseRoute}/api/auth/set-avatar`;
export const getUsersRoute = `${baseRoute}/api/auth/get-users`;
export const delAccountRoute = `${baseRoute}/api/auth/del-account`;
export const changePasswordRoute = `${baseRoute}/api/auth/new-pass`;
export const forgetPasswordRoute = `${baseRoute}/api/auth/forget-password`;
export const verifyResetRoute = `${baseRoute}/api/auth/verify-reset`;
export const resetPasswordRoute = `${baseRoute}/api/auth/reset-password`;
export const getAvatarsRoute = `${baseRoute}/api/auth/get-avatars`;
