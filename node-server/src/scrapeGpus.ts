
import axios from 'axios'
import axiosRetry from 'axios-retry'
import cheerio from 'cheerio'
import { BestBuyProduct, GpuInfo, GpuStock } from '../interfaces/interfaces'
import { GpuType } from './GpuType'

let gpuStock: GpuStock = {
    nvidia3060Ti: [],
    nvidia3070: [],
    nvidia3080: [],
    nvidia3090: [],
    amdRx6800: [],
    amdRx6800Xt: [],
    amdRx6900Xt: []
}

/**
 * Filter a set of Gpus and return only those currently in stock, maintaining sort order
 * @param gpus set of Gpus to filter
 */
export function getGpusInStock(gpus: GpuStock): GpuStock {
    let gpusInStock: GpuStock = {
        nvidia3060Ti: gpus.nvidia3060Ti.filter(gpuInfo => gpuInfo.inStock),
        nvidia3070: gpus.nvidia3070.filter(gpuInfo => gpuInfo.inStock),
        nvidia3080: gpus.nvidia3080.filter(gpuInfo => gpuInfo.inStock),
        nvidia3090: gpus.nvidia3090.filter(gpuInfo => gpuInfo.inStock),
        amdRx6800: gpus.amdRx6800.filter(gpuInfo => gpuInfo.inStock),
        amdRx6800Xt: gpus.amdRx6800Xt.filter(gpuInfo => gpuInfo.inStock),
        amdRx6900Xt: gpus.amdRx6900Xt.filter(gpuInfo => gpuInfo.inStock)
    }

    return gpusInStock
}

/**
 * Updates the list of gpus sold by vendors
 */
export async function updateGpus(): Promise<GpuStock> {
    let gpus = await getBestBuyGpus()
    append(gpus, await getSamsClubGpus())
    append(gpus, await getNeweggGpus())
    gpuStock = sortGpus(gpus)
    return gpuStock
}

/**
 * Gets the list of gpus sold by vendors. They come sorted by availability and price
 */
export function getGpus(): GpuStock {
    return gpuStock
}

/**
 * Gets the list of a specific gpu type sold by vendors
 * @param gpuType The specific type of Gpus to return
 */
export function getGpusOfType(gpuType: GpuType): GpuInfo[] {
    switch (gpuType) {
        case '3060 Ti': {
            return gpuStock.nvidia3060Ti
        }
        case '3070': {
            return gpuStock.nvidia3070
        }
        case '3080': {
            return gpuStock.nvidia3080
        }
        case '3090': {
            return gpuStock.nvidia3090
        }
        case 'RX 6800': {
            return gpuStock.amdRx6800
        }
        case 'RX 6800 XT': {
            return gpuStock.amdRx6800Xt
        }
        case 'RX 6900 XT': {
            return gpuStock.amdRx6900Xt
        }
        default: {
            console.error("Error: Incorrect value recieved: " + gpuType)
            return []
        }
    }
}


/**
 * Sorts a set of gpus by ascending price
 * @param gpus The set of gpus to sort. This variable is not modified by sortGpus()
 * @returns the set of gpus, sorted by ascending price
 */
function sortGpus(gpus: GpuStock): GpuStock {

    const gpusSorted: GpuStock = {
        nvidia3060Ti: gpus.nvidia3060Ti.sort(compareGpuPrices),
        nvidia3070: gpus.nvidia3070.sort(compareGpuPrices),
        nvidia3080: gpus.nvidia3080.sort(compareGpuPrices),
        nvidia3090: gpus.nvidia3090.sort(compareGpuPrices),
        amdRx6800: gpus.amdRx6800.sort(compareGpuPrices),
        amdRx6800Xt: gpus.amdRx6800Xt.sort(compareGpuPrices),
        amdRx6900Xt: gpus.amdRx6900Xt.sort(compareGpuPrices)
    }

    return gpusSorted
}

/**
 * Compares the prices of 2 gpus, as needed by functions like sort(). Any GpuInfo with a 
 * negative price will be put as the greater of the two values, as this typically indicates
 * that no pricing information was available
 * @param a GpuInfo to be compared
 * @param b GpuInfo to be compared
 */
function compareGpuPrices(a: GpuInfo, b: GpuInfo): number {
    const priceA = Number(a.price)
    const priceB = Number(b.price)
    if (priceA <= 0) {
        return 1
    } else if (priceB <= 0) {
        return -1
    } else {
        return priceA - priceB
    }
}

/**
 * Appends one set of GpuStocks to another
 * @param gpus The set of GpuStocks to append to. This variable is modified to include the values stores in addtlGpus
 * @param addtlGpus The set of GpuStocks being appended
 * @returns The union of gpus and addtleGpus, as stored in gpus
 */
function append(gpus: GpuStock, addtlGpus: GpuStock): GpuStock {
    gpus.nvidia3060Ti.push(...addtlGpus.nvidia3060Ti)
    gpus.nvidia3070.push(...addtlGpus.nvidia3070)
    gpus.nvidia3080.push(...addtlGpus.nvidia3080)
    gpus.nvidia3090.push(...addtlGpus.nvidia3090)
    gpus.amdRx6800.push(...addtlGpus.amdRx6800)
    gpus.amdRx6800Xt.push(...addtlGpus.amdRx6800Xt)
    gpus.amdRx6900Xt.push(...addtlGpus.amdRx6900Xt)

    return gpus
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getBestBuyGpus(): Promise<GpuStock> {
    const bestBuy3060Ti = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=3060 ti*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuy3070 = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=3070*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuy3080 = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=3080*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuy3090 = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=3090*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuyRx6800 = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=6800*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuyRx6800Xt = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=6800 xt*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY
    const bestBuyRx6900Xt = 'https://api.bestbuy.com/v1/products(categoryPath.id=abcat0507002&name=6900 xt*)?show=name,url,salePrice,onlineAvailability&format=json&apiKey=' + process.env.BESTBUY_API_KEY

    const nvidia3060Tis = await getBestBuyGpu(bestBuy3060Ti, '3060 Ti')
    const nvidia3070s = await getBestBuyGpu(bestBuy3070, '3070')
    const nvidia3080s = await getBestBuyGpu(bestBuy3080, '3080')
    const nvidia3090s = await getBestBuyGpu(bestBuy3090, '3090')
    const amdRx6800s = await getBestBuyGpu(bestBuyRx6800, 'RX 6800')
    const amdRx6800Xts = await getBestBuyGpu(bestBuyRx6800Xt, 'RX 6800 XT')
    const amdRx6900Xts = await getBestBuyGpu(bestBuyRx6900Xt, 'RX 6900 XT')

    const gpuStock: GpuStock = {
        nvidia3060Ti: nvidia3060Tis,
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        amdRx6800: amdRx6800s,
        amdRx6800Xt: amdRx6800Xts,
        amdRx6900Xt: amdRx6900Xts
    }

    return gpuStock
}

async function getSamsClubGpus(): Promise<GpuStock> {

    const samsClubGpus = 'https://www.samsclub.com/b/hard-drives-storage/6890123?clubId=6352&offset=0&rootDimension=pcs_availability%253AOnlinepipsymbProduct%2520Type%253AGraphic%2520Cards&searchCategoryId=6890123&selectedFilter=all&sortKey=relevance&sortOrder=1'

    const nvidia3070s = await getSamsClubGpu(samsClubGpus, '3070', '3070')
    const nvidia3080s = await getSamsClubGpu(samsClubGpus, '3080', '3080')
    const nvidia3090s = await getSamsClubGpu(samsClubGpus, '3090', '3090')

    const gpuStock: GpuStock = {
        nvidia3060Ti: [],
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        amdRx6800: [],
        amdRx6800Xt: [],
        amdRx6900Xt: []
    }

    return gpuStock
}

async function getNeweggGpus(): Promise<GpuStock> {
    const newegg3060Ti = 'https://www.newegg.com/p/pl?N=100007709%20601359415&PageSize=96'
    const newegg3070 = 'https://www.newegg.com/p/pl?N=100007709%20601357250&PageSize=96'
    const newegg3080 = 'https://www.newegg.com/p/pl?N=100007709%20601357247&PageSize=96'
    const newegg3090 = 'https://www.newegg.com/p/pl?N=100007709%20601357248&PageSize=96'
    const neweggRx6800 = 'https://www.newegg.com/p/pl?N=100007709%20601359427&PageSize=96'
    const neweggRx6800Xt = 'https://www.newegg.com/p/pl?N=100007709%20601359422&PageSize=96'
    const neweggRx6900Xt = 'https://www.newegg.com/p/pl?N=100007709%20601359957&PageSize=96'

    const nvidia3060Tis = await getNeweggGpu(newegg3060Ti, '3060 Ti')
    const nvidia3070s = await getNeweggGpu(newegg3070, '3070')
    const nvidia3080s = await getNeweggGpu(newegg3080, '3080')
    const nvidia3090s = await getNeweggGpu(newegg3090, '3090')
    const amdRx6800s = await getNeweggGpu(neweggRx6800, 'RX 6800')
    const amdRx6800Xts = await getNeweggGpu(neweggRx6800Xt, 'RX 6800 XT')

    const gpuStock: GpuStock = {
        nvidia3060Ti: nvidia3060Tis,
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        amdRx6800: amdRx6800s,
        amdRx6800Xt: amdRx6800Xts,
        amdRx6900Xt: []
    }

    return gpuStock
}

async function getBestBuyGpu(url: string, gpuType: GpuType): Promise<GpuInfo[]> {
    axiosRetry(axios, {
        retries: 5,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: error => error.response?.status === 403
    })

    let pageNum: number = 1
    let totalPages: number
    let gpuResponses: any[] = new Array()

    do {
        const res = await axios.get(url + '&page=' + pageNum)
        const data = res.data
        totalPages = data.totalPages
        data.products.forEach((product: BestBuyProduct) => { gpuResponses.push(product) })
        pageNum++
    } while (pageNum <= totalPages)

    let gpus: GpuInfo[] = new Array()
    gpuResponses.forEach(product => {
        const gpu: GpuInfo = {
            name: product.name,
            gpuType: gpuType,
            address: product.url,
            price: product.salePrice,
            inStock: product.onlineAvailability
        }

        gpus.push(gpu)
    })

    return gpus
}

async function getSamsClubGpu(url: string, keyword: string, gpuType: GpuType): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.sc-pc-medium-desktop-card.sc-plp-cards-card').each(function (this: cheerio.Element, index, element) {
        const infoBlock = $(this).children('a')
        const priceBlock = $(this).children('.sc-pc-medium-desktop-moneybox')

        const name = infoBlock.children('.sc-pc-title-medium').children('h3').text()
        // return early if Gpu is wrong type
        if (!name.includes(keyword)) {
            return
        }
        const addressPrefix = 'https://www.samsclub.com'
        const address = addressPrefix + infoBlock.attr('href')

        const priceDollars = priceBlock.find('.Price-characteristic').text()
        const priceCents = priceBlock.find('.Price-mantissa').text()
        const itemStatusButton = priceBlock.find('.sc-btn.sc-btn-primary.sc-btn-block.sc-pc-action-button.sc-pc-add-to-cart')
        const itemStatus = itemStatusButton.attr('disabled')
        // instock if disabled attr doesn't exist (either undefined or false)
        const inStock = (typeof itemStatus === typeof undefined || itemStatus === 'false')

        const gpu: GpuInfo = {
            name: name,
            gpuType: gpuType,
            address: address,
            price: createPrice(priceDollars, priceCents),
            inStock: inStock
        }

        gpus.push(gpu)
    })
    return gpus
}

async function getNeweggGpu(url: string, gpuType: GpuType): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.item-container').each(function (this: cheerio.Element, index, element) {
        const infoBlock = $(this).children('.item-info')
        const priceBlock = $(this).children('.item-action')

        const name = infoBlock.children('a').text()
        const address = infoBlock.children('a').attr('href')
        const inStockText = priceBlock.find('.btn.btn-primary.btn-mini').text()
        const inStock = (inStockText === 'Add to cart ')
        let priceDollars: string
        let priceCents: string
        if (inStock) {
            // TODO: All pricing stuff should be internationalized
            priceDollars = priceBlock.find('.price-current').children('strong').text()
            priceCents = priceBlock.find('.price-current').children('sup').text()
        } else {
            priceDollars = ''
            priceCents = ''
        }
        const gpu: GpuInfo = {
            name: name,
            gpuType: gpuType,
            address: address || '',
            price: createPrice(priceDollars, priceCents),
            inStock: inStock
        }

        gpus.push(gpu)
    })

    return gpus
}

/**
 * Convert a set of dollars and cents into a single price string
 * @param dollars Number of dollars in price. Can optionally include cents
 * @param cents Number of cents in price. Must be < 100
 */
function createPrice(dollars: number | string, cents?: number | string): string {
    // TODO: Eventually this should be replaced with some actually decent localization
    // For now, remove commas and dollar signs
    const dollarsStringSanitized = dollars.toString().replace('$', '').replace(',', '')
    const dollarsNum = Number(dollarsStringSanitized)
    if (dollarsNum === 0) {
        return ''
    }
    cents = cents || 0
    const priceNum = dollarsNum + (Number(cents) / 100)
    const price = Number(priceNum).toFixed(2)
    return price
}