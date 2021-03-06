import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token,
      image: user.image,
      AccessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return { ...token, error: "Refresh token failed" };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  //   NEXT_PUBLIC_SPOTIFY_CLIENT_ID:d8e0a70e016c4e1ca1bcaf628864ce72
  // NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET:0950521c84854342a391f04486dde383

  providers: [
    SpotifyProvider({
      clientId: "d8e0a70e016c4e1ca1bcaf628864ce72",
      clientSecret: "0950521c84854342a391f04486dde383",

      // clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      // clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          image: user.image,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await spotify.refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;
      session.user.refreshTokenExpires = token.refreshTokenExpires;
      session.user.username = token.username;
      session.user.image = token.image;
      return session;
    },
  },
});
