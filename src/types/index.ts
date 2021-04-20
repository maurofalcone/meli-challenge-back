export interface QueryResult {
    id: string;
    site_id: string;
    title: string;
    seller_id: APISellerInfo;
    price: number,
    prices: {
        id: string;
        prices: Price[];
        presentation: {
            display_currency: string;
        };
        payment_method_prices: any[];
        reference_prices: Price[];
        pucharse_discounts: any[];
    },
    sale_price: number | null;
    currency_id: string;
    available_quantity: number;
    sold_quantity: number;
    buying_mode: string;
    listing_type_id: string;
    stop_time: string;
    condition: string;
    permalink: string;
    thumbnail: string;
    thumbnail_id: string;
    accepts_mercadopago: boolean
    installments: {
        quantity: number;
        amount: number;
        rate: number;
        currency_id: string;
    };
    address: Address;
    shipping: Shipping;
    seller_address: {
        id: string;
        comment: string;
        address_line: string;
        zip_code: number;
        country: object;
        state: object;
        city: object;
        latitude: string;
        longitude: string;
    },
    attributes: Attributes;
    original_price: null;
    category_id: string;
    official_store_id: string | null;
    domain_id: string;
    catalog_product_id: string;
    tags: string[];
    catalog_listing: boolean;
    use_thumbnail_id: boolean;
    order_backend: number;
}

interface CategoriePathFromRoot {
    id: string;
    name: string;
}

interface ChildrenCategories extends CategoriePathFromRoot {
    total_items_in_this_category: number;
}

interface CategorieSettings {
    adult_content: boolean;
    buying_allowed: boolean;
    buying_modes: string[];
    catalog_domain: string;
    coverage_areas: string;
    currencies: string[];
    fragile: boolean;
    immediate_payment: string;
    item_conditions: string[];
    items_reviews_allowed: boolean;
    listing_allowed: boolean;
    max_description_length: number;
    max_pictures_per_item: number;
    max_pictures_per_item_var: number;
    max_sub_title_length: number;
    max_title_length: number;
    maximum_price: number | null;
    minimum_price: number;
    mirror_category: string | null;
    mirror_master_category: string | null;
    mirror_slave_categories: string[];
    price: string;
    reservation_allowed: string;
    restrictions: any[];
    rounded_address: boolean;
    seller_contact: string;
    shipping_modes: string[];
    shipping_options: string[];
    shipping_profile: string;
    show_contact_information: boolean;
    simple_shipping: string;
    stock: string;
    sub_vertical: string;
    subscribable: boolean;
    tags: string[];
    vertical: string;
    vip_subdomain: string;
    buyer_protection_programs: string;
    status: string;
}

export interface APICategorie {
    id: string;
    name: string;
    picture: string;
    permalink: string;
    total_items_in_this_category: number;
    path_from_root: CategoriePathFromRoot[];
    children_categories: ChildrenCategories[];
    attribute_types: string;
    settings: CategorieSettings;
    channels_settings: any[];
    meta_categ_id: string | number;
    attributable: boolean;
    date_created: string;
}

export interface APICurrency {
    id: string;
    symbol: string;
    description: string;
    decimal_places: number;
}

export interface ClientItemResponse {
    categories: string[];
    items: Item[];
}

export interface ItemRequestQuery {
    q: string;
}

export interface ItemRequestParam {
    id: string;
}

export interface Author {
    name: string;
    lastname: string;
}

export interface APISearchResponse {
    site_id: string;
    query: string;
    paging: Paging;
    results: QueryResult[];
    sort: SortModel;
    available_sort: APISearchResponse['sort'][];
    secondary_results: APISearchResponse['results'],
    related_results: APISearchResponse['results'],
}

interface SortModel {
    id: string;
    name: string;
}

interface Paging {
    total: number;
    primary_results: number;
    offset: number;
    limit: number;
}

interface APIPicture {
    id: string;
    url: string;
    secure_url: string;
    size: string
    max_size: string;
    quality: string;
}

export interface APIItemDescription extends Omit<Item, 'free_shipping' | 'price'> {
    plain_text?: string;
    shipping?: {
        free_shipping: boolean;
    };
    pictures: APIPicture[];
    thumbnail?: string;
    secure_thumbnail?: string;
    description: string;
    sold_quantity: number;
    currency_id?: string;
    free_shipping?: boolean;
    price: number;
    seller_id: string | number;
}

export interface Item {
    id: string;
    title: string;
    price: {
        currency: string;
        amount: number;
        decimals: number;
    };
    picture: string;
    condition: string;
    free_shipping: boolean;
    location: string;
}

interface ClientItemDescription extends Omit<APIItemDescription, 'price' | 'seller_id' | 'pictures' | 'location'> {
    price: Item['price'];
    picture: Item['picture'];
}

export interface ClientItemDescriptionResponse {
    author: Author;
    item: ClientItemDescription;
}

interface AttributesValue {
    id: number;
    name: string;
    struct: any;
    source: number;
}

interface Attributes {
    id: string;
    name: string;
    value_id: number;
    attribute_group_name: string;
    source: number;
    value_name: string;
    value_struct: any;
    values: AttributesValue[];
    attribute_group_id: string;
}

interface Address {
    state_id: string;
    state_name: string;
    city_id: string;
    city_name: string;
}

interface Shipping {
    free_shipping: boolean;
    mode: string;
    tags: string[];
    logistic_type: string;
    store_pick_up: boolean;
}

interface PriceConditions {
    context_restrictions: any[];
    start_time: string | null;
    end_time: string | null;
    eligible: boolean;
}

interface Price {
    id: string;
    type: string;
    conditions: PriceConditions;
    amount: number;
    regular_amount: number | null;
    currency_id: string;
    exchange_rate_context: string;
    metadata: object;
    last_updated: string;
}

interface Eshop {
    nick_name: string;
    eshop_rubro: string | null;
    eshop_id: number;
    eshop_locations: any[];
    site_id: string;
    eshop_logo_url: string;
    eshop_status_id: number;
    seller: number;
    eshop_experience: number;
}

interface Transactions {
    total: number;
    canceled: number;
    period: string;
    ratings: {
        negative: number;
        positive: number;
        neutral: number;
    },
    completed: number;
}

interface SellerMetricsClaims {
    rate: number;
    value: number;
    period: string;
}

interface SellerMetricsDelayedHandlingTime {
    rate: number;
    value: number;
    period: string;
}

interface SellerMetricsSales {
    period: string;
    completed: number;
}

interface SellerMetricsCancellations {
    rate: number;
    value: number;
    period: string;
}

interface SellerMetrics {
    claims: SellerMetricsClaims;
    delayed_handling_time: SellerMetricsDelayedHandlingTime;
    sales: SellerMetricsSales;
    cancellations: SellerMetricsCancellations;
}

interface SellerReputation {
    transactions: Transactions;
    power_seller_status: string,
    metrics: SellerMetrics;
    level_id: string;
}

export interface APISellerInfo {
    id: number;
    nickname: string;
    permalink: string;
    registration_date: string;
    car_dealer: boolean;
    real_estate_agency: boolean;
    tags: string[];
    eshop: Eshop;
    seller_reputation: SellerReputation;
}