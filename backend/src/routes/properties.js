const express = require("express");
const router = express.Router();
const pool = require("../db");
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const DEFAULT_OFFSET = 0;

function getPagination(query) {
    const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);
     const offset = query.offset === undefined ? DEFAULT_OFFSET : Number(query.offset);

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        return { error: `limit must be an integer between 1 and ${MAX_LIMIT}` };
    }

    if (!Number.isInteger(offset) || offset < 0) {
        return { error: `offset must be a non-negative integer` };
    }
    return { limit, offset };
}

function parseFilterString(value, name) {
    const trimmed = value.trim();
    if (trimmed === ""){
        return {error: `${name} filter cannot be empty`};
    }
    return {value: trimmed};
}

function parseFilterNumber(value, name) {
    const trimmed = value.trim();
    if (trimmed === ""){
        return {error: `${name} filter cannot be empty`};
    }
    const number = Number(trimmed);
    if (Number.isNaN(number)) {
        return {error: `${name} filter must be a valid number`};
    }
    if (number < 0) {
        return {error: `${name} filter must be a non-negative number`};
    }
    return {value: number};
}

function parseFilterInteger(value, name) {
    const number = parseFilterNumber(value, name);
    if (number.error) {
        return number;
    }
    if (!Number.isInteger(number.value)) {
        return {error: `${name} filter must be a valid integer`};
    }
    return number;
}

function getFilters(query){
    const queryConditions = [];
    const queryValues = [];

    if (query.city !== undefined) {
        const city = parseFilterString(query.city, "city");
        if (city.error) {
            return { error: city.error };
        }
        queryConditions.push("LOWER(TRIM(L_City)) = LOWER(?)");
        queryValues.push(city.value);
    }
    if (query.zipcode !== undefined) {
        const zipcode = parseFilterString(query.zipcode, "zipcode");
        if (zipcode.error) {
            return { error: zipcode.error };
        }
        queryConditions.push("TRIM(L_Zip) = TRIM(?)");
        queryValues.push(zipcode.value);
    }
    if (query.minPrice !== undefined) {
        const minPrice = parseFilterNumber(query.minPrice, "minPrice");
        if (minPrice.error) {
            return { error: minPrice.error };
        }
        queryConditions.push("L_SystemPrice >= ?");
        queryValues.push(minPrice.value);
    }
    if (query.maxPrice !== undefined) {
        const maxPrice = parseFilterNumber(query.maxPrice, "maxPrice");
        if (maxPrice.error) {
            return { error: maxPrice.error };
        }
        queryConditions.push("L_SystemPrice <= ?");
        queryValues.push(maxPrice.value);
    }
    if (query.beds !== undefined) {
        const beds = parseFilterInteger(query.beds, "beds");
        if (beds.error) {
            return { error: beds.error };
        }
        queryConditions.push("L_Keyword2 = ?");
        queryValues.push(beds.value);
    }
    if (query.baths !== undefined) {
        const baths = parseFilterNumber(query.baths, "baths");
        if (baths.error) {
            return { error: baths.error };
        }
        queryConditions.push("LM_Dec_3 = ?");
        queryValues.push(baths.value);
    }
    const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(" AND ")}` : "";
    return { whereClause, queryValues };
}

router.get("/", async (req, res) => {
    const pagination = getPagination(req.query);
    if (pagination.error) {
        return res.status(400).json({ error: pagination.error });
    }
    const filters = getFilters(req.query);
    if (filters.error) {
        return res.status(400).json({ error: filters.error });
    }
    const { limit, offset } = pagination;
    const { whereClause, queryValues } = filters;
    try{
        const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM rets_property ${whereClause}`, queryValues);
        const [propertyResults] = await pool.query(`SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`, [...queryValues, limit, offset]);
        res.json({
            total: countRows[0].total,
            limit,
            offset,
            results: propertyResults
        });
    } catch (error) {
        res.status(500).json({error: "Error fetching properties"});
    }
});

module.exports = router;