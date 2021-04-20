import express, { Request, Response } from "express";
import { ML_CURRENCIES_BY_ID, ML_ITEMS_BY_CATEGORIE, ML_ITEMS_BY_ID, ML_QUERY_URL, NO_RESULTS_MESSAGE, ML_SELLERS_BY_ID } from "../../../constants";
import axios, { AxiosResponse } from "axios";
import { APISellerInfo, APISearchResponse, Item, APIItemDescription, ClientItemDescriptionResponse, ClientItemResponse, QueryResult, ItemRequestQuery, APICategorie, APICurrency, ItemRequestParam } from "../../../types";
import { ParamsDictionary } from "express-serve-static-core";
// tslint:disable:no-console

const router = express.Router();

const getCategorieById = (id: string) => axios.get<APICategorie>(`${ML_ITEMS_BY_CATEGORIE}/${id}`);

const getCurrencyById = (id: string) => axios.get<APICurrency>(`${ML_CURRENCIES_BY_ID}/${id}`);

const searchItems = (query: string): Promise<AxiosResponse<APISearchResponse>> => axios.get<APISearchResponse>(ML_QUERY_URL + query);

const getItemById = (id: string): Promise<AxiosResponse<APIItemDescription>> => axios.get<APIItemDescription>(`${ML_ITEMS_BY_ID}/${id}`);

const getItemDescription = (id: string): Promise<AxiosResponse<APIItemDescription>> => axios.get<APIItemDescription>(`${ML_ITEMS_BY_ID}/${id}/description`);

const getSellerInfo = (id: string): Promise<AxiosResponse<APISellerInfo>> => axios.get<APISellerInfo>(`${ML_SELLERS_BY_ID}/${id}`);

// TO-DO: create a controller folder with functions to perform CRUD operations instead of nesting code on the routes.

router.get("/", async (req: Request<ParamsDictionary, {}, {}, ItemRequestQuery>, res: Response<ClientItemResponse>) => {
    try {
        if (!req.query.q) {
            res.boom.notFound(NO_RESULTS_MESSAGE);
        }

        const { data: apiResponse } = await searchItems(req.query.q);
        if (!apiResponse) {
            res.boom.notFound(NO_RESULTS_MESSAGE);
        }

        const categories = new Set<string>();

        const products = await Promise.all(apiResponse.results.map(async (item: QueryResult): Promise<Item> => {
            try {
                const { data: itemCategorie } = await getCategorieById(item.category_id);
                const { data: currency } = await getCurrencyById(item.currency_id);
                console.log(currency);
                categories.add(itemCategorie.name);
                return {
                    title: item.title,
                    price: {
                        currency: currency.symbol,
                        amount: item.price,
                        decimals: currency.decimal_places,
                    },
                    id: item.id,
                    picture: item.thumbnail,
                    condition: item.condition,
                    free_shipping: item.shipping.free_shipping,
                    location: item.address.state_name || '',
                }
            } catch (error) {
                res.boom.notFound((error as Error).message);
            }
        }));

        const myResponse: ClientItemResponse = {
            categories: Array.from(categories),
            items: products.slice(0, 4),
        }
        res.send(myResponse).status(200).json();
    } catch (error) {
        res.boom.internal((error as Error).message);
    }
});

router.get("/:id", async (req: Request<ItemRequestParam>, res: Response<ClientItemDescriptionResponse>) => {
    try {
        const { data: productFound } = await getItemById(req.params.id);
        const { data: sellerInfo } = await getSellerInfo(productFound.seller_id.toString());
        const { data: currencyInfo } = await getCurrencyById(productFound.currency_id);
        const { data: productFoundDescription } = await getItemDescription(productFound.id);

        if (!productFound) {
            res.boom.notFound(NO_RESULTS_MESSAGE);
        }

        const index = sellerInfo.nickname.trimEnd().lastIndexOf(' ');
        const lastNameStartIndex = index + 1;
        const lastNameEndIndex = sellerInfo.nickname.length - 1;

        const myResponse: ClientItemDescriptionResponse = {
            author: {
                name: sellerInfo && sellerInfo.nickname ? sellerInfo.nickname.slice(0, index) : '',
                lastname: sellerInfo && sellerInfo.nickname ? sellerInfo.nickname.slice(lastNameStartIndex, lastNameEndIndex) : '',
            },
            item: {
                id: productFound.id,
                title: productFound.title,
                price: {
                    currency: currencyInfo.symbol,
                    amount: productFound.price,
                    decimals: currencyInfo.decimal_places,
                },
                picture: productFound.pictures.length ? productFound.pictures[0].secure_url : '',
                condition: productFound.condition,
                description: productFoundDescription.plain_text,
                free_shipping: productFound.shipping.free_shipping,
                sold_quantity: productFound.sold_quantity || 0,
            }

        };
        res.send(myResponse).status(200).json();
    } catch (error) {
        console.log(error);
        res.boom.internal((error as Error).message);
    }
})
export default router;