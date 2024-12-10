import express from "express";
import user from "./user.routes";
import stock from "./stock.routes";
import sales from "./sales.routes";
import avaris from "./avaris.routes";
import product from "./product.routes";
import emptyStore from "./emptyStore.routes";
import supplyBox from "./supplyBox.routes";
import group from "./group.routes";
import achat from "./achat.routes";
import fundExpenses from "./fundExpense.routes";
import charge from "./chargement.routes";
import retour from"./retour.routes";
import activity from "./activity.routes"
import auth from "./auth.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);
router.use(stock);
router.use(product);
router.use(sales);
router.use(avaris);
router.use(emptyStore);
router.use(group);
router.use(supplyBox);
router.use(fundExpenses);
router.use(achat);
router.use(charge);
router.use(retour);
router.use(activity)


export default router;
