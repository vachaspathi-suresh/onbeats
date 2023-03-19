export const baseRoute = "http://localhost:5000";
export const ownRoute = "http://localhost:3000";

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
export const createSessionRoute = `${baseRoute}/api/auth/create-session`;
export const manageSubscriptionRoute = `${baseRoute}/api/auth/manage-subscription`;
export const addSubscriptionRoute = `${baseRoute}/api/auth/add-subscription`;

/********************** Song-routes **************************/

export const getSongsRoute = `${baseRoute}/api/songs/get-songs`;
export const getSongCoverRoute = `${baseRoute}/api/songdata/cover`;
export const getSongRoute = `${baseRoute}/api/songsdata/song`;
export const createPlaylistRoute = `${baseRoute}/api/songs/create-playlist`;
export const addToPlaylistRoute = `${baseRoute}/api/songs/add-to-playlist`;
export const getPlaylistNamesRoute = `${baseRoute}/api/songs/get-playlist-names`;
export const getPlaylistsRoute = `${baseRoute}/api/songs/get-playlists`;
export const changePlaylistNameRoute = `${baseRoute}/api/songs/change-playlist-name`;
export const removeFromPlaylistRoute = `${baseRoute}/api/songs/remove-from-playlist`;
export const deletePlaylistRoute = `${baseRoute}/api/songs/delete-playlist`;
export const adminAddSongRoute = `${baseRoute}/api/songs/admin-add-songs`;
export const adminDeleteSongRoute = `${baseRoute}/api/songs/admin-delete-song`;
export const adminUpdateSongRoute = `${baseRoute}/api/songs/admin-update-song`;
