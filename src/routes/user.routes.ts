import { Router } from 'express';
import { checkJwt } from '../middleware/session';
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const router = Router();
import {getAllCompanies, getFollowedCompanies, googleCallback, Google, updateAvatar, refreshAccesToken, postUser, getAllUsers, getUserById, InactivateUserById, getUserByEmail, updateUserById, getUserByName, ativateUserById, getAllActiveUsers, getUsersByFiltration, loginUser, addFollowed, UnfollowCompany } from '../controllers/user.controller'
import passport from 'passport';




router.get( "/ActiveUsers/", checkJwt, getAllActiveUsers);
router.get( "/usersByFiltration/", checkJwt,  getUsersByFiltration);
router.get( "/", checkJwt,  getAllUsers);
router.post( "/",  postUser );
router.get('/:id', checkJwt,  getUserById);
router.get('/name/:name', checkJwt,  getUserByName);
router.get('/email/:email', checkJwt,  getUserByEmail);
router.get('/followedCompanies/:id', checkJwt,  getFollowedCompanies);
router.get('/companies/:id', checkJwt,  getAllCompanies);
router.put("/updateAvatar", checkJwt, updateAvatar);

router.put('/:id', checkJwt,  updateUserById);
router.put('/InactivateFlag/:id', checkJwt,  InactivateUserById);
router.put('/ActivateFlag/:id', checkJwt,  ativateUserById);

router.post("/login", loginUser);


router.get('/auth/google', Google);
  
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/users/login',
    session: false,
  }),
  googleCallback
  
);
  
router.post('/auth/refresh', refreshAccesToken);
router.put('/follows/:id', addFollowed);
router.put('/unfollow/:id', UnfollowCompany);
export default router;