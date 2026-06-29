import { Request, Response } from "express";

import {createTable, getAllRows, getRedirectId, insertIntoDb } from '../model/db'
import { randomUrl } from "../utils/crypto"

//shows all rows from db
export async function allRows(req : Request, res: Response) : Promise<void> {
    const result = await getAllRows();
    res.json({
        'RESULT' : result.rows
    })
}

export async function addToDb(req: Request, res : Response) : Promise<void> {

    const {url} = req.body as {url : string};
    if (url) {
        //randomizing new url
        const token : string = randomUrl();
        await insertIntoDb(url, token);
        res.json({ "Shortened URL" : `http://localhost:3000/${token}` });
    }   
    else{
        res.end("No url submitted, Try again!");
    } 
}

export async function redirectId(req: Request, res: Response){
    const shortId = req.params.shortId as string;
    const redirect = await getRedirectId(shortId);
    if (redirect)
    res.redirect(redirect);
}