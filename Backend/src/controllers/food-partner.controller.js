const foodModel = require('../models/food.model.js')
const foodPartnerModel = require('../models/foodpartner.model.js')
const likeModel = require('../models/likes.model.js')
const saveModel = require('../models/save.model.js')

async function getFoodPartnerById(req, res) {
    const { id } = req.params

    const foodPartner = await foodPartnerModel.findById(id)
    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' })
    }
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: id })
    res.status(200).json({
        message: 'Food partner found successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function getFoodPartnerBySlug(req, res) {
    const { slug } = req.params

    const foodPartner = await foodPartnerModel.findOne({ slug })
    if (!foodPartner) {
        return res.status(404).json({ message: 'Food partner not found' })
    }
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartner._id })
    res.status(200).json({
        message: 'Food partner found successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function getMyProfile(req, res) {
    const foodPartner = req.foodPartner
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartner._id })
    res.status(200).json({
        message: 'Profile fetched successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }
    })
}

async function getMyReels(req, res) {
    const foodPartner = req.foodPartner

    // Get only food items with videos
    const reels = await foodModel.find({
        foodPartner: foodPartner._id,
        $or: [
            { video: { $exists: true, $ne: null } },
            { videoUrl: { $exists: true, $ne: null } }
        ]
    }).sort({ createdAt: -1 })

    res.status(200).json({
        message: 'Reels fetched successfully',
        reels
    })
}

async function updateMyProfile(req, res) {
    const foodPartner = req.foodPartner
    const { fullName, contactName, phone, address } = req.body

    const updateData = {}
    if (fullName) updateData.fullName = fullName
    if (contactName) updateData.contactName = contactName
    if (phone) updateData.phone = phone
    if (address) updateData.address = address

    const updatedPartner = await foodPartnerModel.findByIdAndUpdate(
        foodPartner._id,
        updateData,
        { new: true }
    )

    res.status(200).json({
        message: 'Profile updated successfully',
        foodPartner: updatedPartner
    })
}

async function getFoodPartnerVideos(req, res) {
    const { id } = req.params
    const user = req.user

    const foodItems = await foodModel.find({ foodPartner: id })

    let foodItemsWithStatus

    if (user) {
        const userLikes = await likeModel.find({
            user: user._id,
            food: { $in: foodItems.map(item => item._id) }
        }).select('food')
        const userSaves = await saveModel.find({
            user: user._id,
            food: { $in: foodItems.map(item => item._id) }
        }).select('food')

        const likedFoodIds = userLikes.map(like => like.food.toString())
        const savedFoodIds = userSaves.map(save => save.food.toString())

        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: likedFoodIds.includes(item._id.toString()),
            isSaved: savedFoodIds.includes(item._id.toString())
        }))
    } else {
        foodItemsWithStatus = foodItems.map(item => ({
            ...item.toObject(),
            isLiked: false,
            isSaved: false
        }))
    }

    res.status(200).json({ message: 'Food partner videos fetched successfully', foodItems: foodItemsWithStatus })
}

// Helper function to escape regex special characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Helper function to create fuzzy search pattern
function createFuzzyPattern(query) {
    // Allow for 1 character difference per 4 characters
    const tolerance = Math.floor(query.length / 4)
    if (tolerance === 0) return escapeRegex(query)

    // Create pattern that allows for character substitutions
    return query.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            return `[${char}${char.toLowerCase()}${char.toUpperCase()}]?`
        }
        return escapeRegex(char) + '?'
    }).join('.*?')
}

// Helper function to determine match type for ranking
function getMatchType(partner, query) {
    const lowerQuery = query.toLowerCase()
    const lowerName = partner.fullName.toLowerCase()
    const lowerAddress = partner.address?.toLowerCase() || ''
    const cuisines = partner.cuisineType?.map(c => c.toLowerCase()) || []

    if (lowerName.startsWith(lowerQuery)) return 'name_start'
    if (lowerName.includes(lowerQuery)) return 'name_contains'
    if (cuisines.some(c => c.includes(lowerQuery))) return 'cuisine_match'
    if (lowerAddress.includes(lowerQuery)) return 'address_match'
    return 'fuzzy_match'
}

async function searchPartners(req, res) {
    try {
        const { q, cuisine, limit = 10 } = req.query

        // Input validation
        if (!q) {
            return res.status(400).json({
                message: 'Search query is required',
                partners: []
            })
        }

        const searchQuery = q.trim()

        if (searchQuery.length < 1) {
            return res.status(400).json({
                message: 'Search query cannot be empty',
                partners: []
            })
        }

        if (searchQuery.length > 100) {
            return res.status(400).json({
                message: 'Search query too long (max 100 characters)',
                partners: []
            })
        }

        const searchLimit = Math.min(parseInt(limit) || 10, 20) // Max 20 results

        let searchResults = []

        // Strategy 1: Full-text search (most relevant)
        if (searchQuery.length >= 2) {
            try {
                const textSearchQuery = {
                    $text: { $search: searchQuery },
                    isActive: true
                }

                // Add cuisine filter if specified
                if (cuisine && cuisine.trim()) {
                    textSearchQuery.cuisineType = {
                        $in: [new RegExp(cuisine.trim(), 'i')]
                    }
                }

                const textResults = await foodPartnerModel.find(
                    textSearchQuery,
                    { score: { $meta: 'textScore' } }
                )
                    .select('fullName address profileImg slug cuisineType rating totalReviews')
                    .sort({ score: { $meta: 'textScore' }, rating: -1 })
                    .limit(searchLimit)

                searchResults = textResults
            } catch (textSearchError) {
                console.log('Text search not available, falling back to regex')
            }
        }

        // Strategy 2: Regex search with fuzzy matching (fallback)
        if (searchResults.length < searchLimit) {
            const remainingLimit = searchLimit - searchResults.length

            // Create fuzzy regex patterns
            const fuzzyPattern = createFuzzyPattern(searchQuery)
            const exactPattern = new RegExp(escapeRegex(searchQuery), 'i')

            const regexQuery = {
                $and: [
                    { isActive: { $ne: false } }, // Include undefined as active
                    {
                        $or: [
                            { fullName: { $regex: exactPattern } },
                            { address: { $regex: exactPattern } },
                            { cuisineType: { $in: [exactPattern] } },
                            { fullName: { $regex: fuzzyPattern, $options: 'i' } }
                        ]
                    }
                ]
            }

            // Add cuisine filter if specified
            if (cuisine && cuisine.trim()) {
                regexQuery.$and.push({
                    cuisineType: { $in: [new RegExp(cuisine.trim(), 'i')] }
                })
            }

            // Exclude already found results
            if (searchResults.length > 0) {
                const foundIds = searchResults.map(r => r._id)
                regexQuery.$and.push({ _id: { $nin: foundIds } })
            }

            const regexResults = await foodPartnerModel.find(regexQuery)
                .select('fullName address profileImg slug cuisineType rating totalReviews')
                .sort({ rating: -1, totalReviews: -1, fullName: 1 })
                .limit(remainingLimit)

            searchResults = [...searchResults, ...regexResults]
        }

        // Strategy 3: Partial match on cuisine types (if still need more results)
        if (searchResults.length < searchLimit && searchQuery.length >= 3) {
            const remainingLimit = searchLimit - searchResults.length

            const cuisineQuery = {
                $and: [
                    { isActive: { $ne: false } },
                    { cuisineType: { $in: [new RegExp(searchQuery, 'i')] } }
                ]
            }

            // Exclude already found results
            if (searchResults.length > 0) {
                const foundIds = searchResults.map(r => r._id)
                cuisineQuery.$and.push({ _id: { $nin: foundIds } })
            }

            const cuisineResults = await foodPartnerModel.find(cuisineQuery)
                .select('fullName address profileImg slug cuisineType rating totalReviews')
                .sort({ rating: -1, totalReviews: -1 })
                .limit(remainingLimit)

            searchResults = [...searchResults, ...cuisineResults]
        }

        // Enhance results with additional metadata
        const enhancedResults = searchResults.map(partner => ({
            ...partner.toObject(),
            matchType: getMatchType(partner, searchQuery),
            displayCuisine: partner.cuisineType?.slice(0, 2).join(', ') || ''
        }))

        res.status(200).json({
            message: 'Search completed successfully',
            partners: enhancedResults,
            total: enhancedResults.length,
            query: searchQuery,
            ...(cuisine && { cuisineFilter: cuisine })
        })

    } catch (error) {
        console.error('Search error:', error)

        // Return user-friendly error messages
        let errorMessage = 'Search temporarily unavailable'

        if (error.name === 'ValidationError') {
            errorMessage = 'Invalid search parameters'
        } else if (error.name === 'MongoNetworkError') {
            errorMessage = 'Database connection error'
        } else if (error.code === 11000) {
            errorMessage = 'Search index error'
        }

        res.status(500).json({
            message: errorMessage,
            partners: [],
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

module.exports = { getFoodPartnerById, getFoodPartnerBySlug, getMyProfile, updateMyProfile, getFoodPartnerVideos, getMyReels }