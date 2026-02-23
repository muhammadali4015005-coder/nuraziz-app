/**
 * ATHLETIC COACH - CLEAN LOCAL SERVER
 * Run: node server.js
 * Access: http://localhost:3000
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import { exec } from 'child_process'
import dbManager from './db-manager.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 5003;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Allowed files only
const allowedFiles = [
    'nuraziz-pro.html',
    'nuraziz-app.html',
    'nuraziz-working.html',
    'nuraziz-final.html',
    'nuraziz-complete.html',
    'nuraziz-complete-v2.html',
    'nuraziz-premium-v3.html',
    'nuraziz-pro-v3.html',
    'nuraziz-unified.html',
    'index-all.html',
    'index.html',
    'index-clean.html',
    'monster-mode.html',
    'advanced-index.html',
    'ultimate-coach.html',
    'nuraziz-schedule.html',
    'athletic-tracker.html',
    'athletic-final.html',
    'athletic-standalone.html',
    'app.html',
    'athletic-data-manager-v2.js',
    'athletic-ai-engine.js',
    'manifest.json',
    'service-worker.js',
    'athletic-app.js',
    'package.json'
];

// Create server
const server = http.createServer(async (req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Log request
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${pathname}`);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        });
        res.end();
        return;
    }

    // API: Admin Login
    if (pathname === '/api/admin/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { pass } = JSON.parse(body);
                console.log('[ADMIN LOGIN] ✓ Request received');
                
                // Admin password is 963
                if (pass === '963') {
                    console.log('[ADMIN LOGIN] ✓ Success');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true, isAdmin: true }));
                } else {
                    console.log('[ADMIN LOGIN] ✗ Invalid password');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Invalid admin password' }));
                }
            } catch (err) {
                console.error('[ADMIN LOGIN] ✗ Error:', err.message);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Register user
    if (pathname === '/api/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                console.log('[REGISTER] ✓ Request received');
                const { phone, pass, name, planCode } = JSON.parse(body);
                console.log('[REGISTER] Data | Phone:', phone, '| Name:', name);
                
                // VALIDATE PHONE - must be exactly 12 digits (998 + 9)
                const cleaned = phone.replace(/\D/g, '');
                if (cleaned.length !== 12) {
                    console.log('[REGISTER] ✗ Phone validation failed | Cleaned:', cleaned, '| Length:', cleaned.length);
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'invalid_phone', 
                        message: '+998 dan keyin 9 ta raqam bo\'lishi kerak!' 
                    }));
                    return;
                }
                console.log('[REGISTER] ✓ Phone validation passed');
                
                // Check if user exists
                const existing = await dbManager.getUser(phone);
                if (existing) {
                    // Agar foydalanuvchi o'chirilgan yoki rad etilgan bo'lsa, uni qayta faollashtirish
                    if (existing.deleted === true || existing.rejected === true) {
                        console.log('[REGISTER] User was deleted/rejected, reactivating:', phone);
                        existing.deleted = false;
                        existing.rejected = false;
                        delete existing.deletedAt;
                        existing.pass = pass;
                        existing.name = name;
                        existing.approved = false; // Admin yana tasdiqlashi kerak
                        existing.createdAt = new Date();
                        
                        await dbManager.saveUser(phone, existing);
                        console.log('[REGISTER] ✓ User reactivated successfully:', phone);
                        res.writeHead(200, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ success: true }));
                        return;
                    }
                    
                    console.log('[REGISTER] ✗ User already exists:', phone);
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'exists' }));
                    return;
                }
                
                // Create new user
                const newUser = {
                    phone,
                    pass,
                    name,
                    approved: false,
                    planCode: planCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
                    plans: [],
                    schedule: {},
                    morning: [],
                    evening: [],
                    goals: [],
                    foods: [],
                    settings: {
                        geminiApiKey: '' // 🤖 Nuraziz AI API key - user-defined
                    },
                    subscriptionActive: true,
                    createdAt: new Date()
                };
                
                console.log('[REGISTER] Saving user...');
                const saved = await dbManager.saveUser(phone, newUser);
                
                if (saved) {
                    console.log('[REGISTER] ✓ User registered successfully:', phone);
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('[REGISTER] ✗ Failed to save user');
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('[REGISTER] ✗ Error:', err.message);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Login user
    if (pathname === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                console.log('[LOGIN] ✓ Request received');
                console.log('[LOGIN] Body:', body);
                
                const { phone, pass } = JSON.parse(body);
                console.log('[LOGIN] ✓ Parsed | Phone:', phone, '| Pass:', pass);
                
                const user = await dbManager.getUser(phone);
                console.log('[LOGIN] User found:', user ? 'YES' : 'NO');
                
                // Check if user exists
                if (!user) {
                    console.log('[LOGIN] ✗ User not found');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'not_found' }));
                    return;
                }
                
                // Check if user is deleted
                if (user.deleted === true) {
                    console.log('[LOGIN] ✗ User deleted');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'deleted' }));
                    return;
                }
                
                // Check if user is rejected by admin (BEFORE password check)
                if (user.rejected === true) {
                    console.log('[LOGIN] ✗ User rejected by admin');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'rejected' }));
                    return;
                }
                
                // Check if user is approved (admin tasdiq) - BEFORE password check
                if (user.approved !== true) {
                    // User is pending approval
                    console.log('[LOGIN] ✗ User not approved by admin');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'not_approved' }));
                    return;
                }
                
                // Check password (AFTER approval check)
                if (user.pass !== pass) {
                    console.log('[LOGIN] ✗ Invalid password');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'wrong_password' }));
                    return;
                }
                
                // 🔧 AUTO-FIX: Check subscription status
                if (user.subscriptionExpiry) {
                    const expiryDate = new Date(user.subscriptionExpiry);
                    const today = new Date();
                    
                    // If expiry is in the future but marked as blocked, auto-fix
                    if (expiryDate >= today && (user.subscriptionActive === false || user.blocked === true)) {
                        console.log('[LOGIN] 🔧 AUTO-FIX: Unblocking user with valid subscription');
                        user.subscriptionActive = true;
                        user.blocked = false;
                        user.blockStatus = null;
                        user.status = 'FAOL';
                        user.blockedMessage = null;
                        await dbManager.saveUser(phone, user);
                        console.log('[LOGIN] ✅ User auto-unblocked');
                    }
                    // If expiry is in the past but marked as active, auto-block
                    else if (expiryDate < today && user.subscriptionActive === true) {
                        console.log('[LOGIN] 🔧 AUTO-FIX: Blocking user with expired subscription');
                        user.subscriptionActive = false;
                        user.blocked = true;
                        user.blockStatus = 'blocked';
                        user.status = 'TUGAGAN';
                        await dbManager.saveUser(phone, user);
                        console.log('[LOGIN] ✅ User auto-blocked');
                    }
                }
                
                // Check if subscription is blocked AFTER auto-fix
                if (user.subscriptionActive === false || user.blocked === true) {
                    console.log('[LOGIN] ✗ Subscription blocked');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'blocked' }));
                    return;
                }
                
                console.log('[LOGIN] ✓ Success');
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, user }));
            } catch (err) {
                console.error('[LOGIN] ✗ Error:', err.message);
                console.error('[LOGIN] ✗ Stack:', err.stack);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save user data
    if (pathname === '/api/save-user' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log('💾 Saving user data to MongoDB:', data.phone);
                
                const success = await dbManager.saveUser(data.phone, data);
                
                if (success) {
                    console.log('✅ User data saved to MongoDB successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save user data to MongoDB');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving user data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Get user data
    if (pathname === '/api/get-user' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                if (!body) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, user: null }));
                    return;
                }
                const data = JSON.parse(body);
                const user = await dbManager.getUser(data.phone);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, user }));
            } catch (err) {
                console.error('❌ Error getting user:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Get all users
    if (pathname === '/api/admin/users' && req.method === 'GET') {
        try {
            const users = await dbManager.getAllUsers();
            const response = { success: true, users: users || [] };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (err) {
            console.error('❌ Error getting users:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin - Approve user
    if (pathname === '/api/admin/approve' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, approved, rejected, subscriptionExpiry } = JSON.parse(body);
                const user = await dbManager.getUser(phone);
                
                if (!user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                    return;
                }
                
                user.approved = approved;
                
                // If admin rejects
                if (rejected === true) {
                    user.rejected = true;
                    user.approved = false;
                    console.log('[ADMIN] User rejected:', phone);
                }
                
                // If admin approves, also ensure subscription and block state are cleared
                if (approved === true) {
                    user.rejected = false;
                    user.subscriptionActive = true;
                    user.blocked = false;
                    user.blockStatus = null;
                    user.blockedMessage = null;
                    user.status = 'FAOL';
                    
                    // Set subscription expiry
                    if (subscriptionExpiry) {
                        user.subscriptionExpiry = subscriptionExpiry;
                        user.approvedAt = new Date().toISOString();
                    }
                    
                    console.log('[ADMIN] User approved:', phone);
                }
                
                await dbManager.saveUser(phone, user);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Remove user (old - keeps for compatibility)
    if (pathname === '/api/admin/remove' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                await dbManager.deleteUser(phone);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Delete user (mark as deleted, prevent login)
    if (pathname === '/api/admin/delete-user' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                console.log('🗑️ Marking user as deleted:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.deleted = true;
                    user.deletedAt = new Date().toISOString();
                    // O'chirilgan foydalanuvchining barcha xabarlarini tozalash
                    user.chatMessages = [];
                    user.adminMessages = [];
                    await dbManager.saveUser(phone, user);
                    console.log('✅ User marked as deleted and messages cleared');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error deleting user:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Restore deleted user
    if (pathname === '/api/admin/restore-user' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                console.log('🔄 Restoring user:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.deleted = false;
                    delete user.deletedAt;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ User restored');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error restoring user:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Permanent delete user (completely remove from MongoDB)
    if (pathname === '/api/admin/permanent-delete' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                console.log('💀 PERMANENTLY deleting user from MongoDB:', phone);
                
                await dbManager.deleteUser(phone);
                console.log('✅ User permanently deleted from MongoDB');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error('❌ Error permanently deleting user:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Get price settings
    if (pathname === '/api/admin/price-settings' && req.method === 'GET') {
        try {
            const settings = await dbManager.getPriceSettings();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                monthlyPrice: settings?.monthlyPrice || settings?.price || 0,
                discount: settings?.discount || 0
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin - Save price
    if (pathname === '/api/admin/save-price' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { price } = JSON.parse(body);
                console.log('💾 Saving price to MongoDB:', price);
                
                const success = await dbManager.savePriceSetting('price', price);
                
                if (success) {
                    console.log('✅ Price saved to MongoDB successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save price to MongoDB');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving price:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Save discount
    if (pathname === '/api/admin/save-discount' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { discount } = JSON.parse(body);
                console.log('💾 Saving discount to MongoDB:', discount);
                
                const success = await dbManager.savePriceSetting('discount', discount);
                
                if (success) {
                    console.log('✅ Discount saved to MongoDB successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save discount to MongoDB');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving discount:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Save price settings (both price and discount)
    if (pathname === '/api/admin/save-price-settings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { monthlyPrice, discount } = JSON.parse(body);
                console.log('💾 Saving price settings to MongoDB:', { monthlyPrice, discount });
                
                // Save both values
                const priceSuccess = await dbManager.savePriceSetting('monthlyPrice', monthlyPrice);
                const discountSuccess = await dbManager.savePriceSetting('discount', discount);
                
                if (priceSuccess && discountSuccess) {
                    console.log('✅ Price settings saved to MongoDB successfully');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save price settings to MongoDB');
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving price settings:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Block subscription
    if (pathname === '/api/admin/block-subscription' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                console.log('🔒 Blocking subscription for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    // Set expiry to yesterday
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    user.subscriptionExpiry = yesterday;
                    user.subscriptionActive = false;
                    user.blocked = true;
                    user.blockStatus = 'blocked';
                    user.status = 'TUGAGAN';
                    user.blockedMessage = `Sizning akkauntingiz TOXTATILGAN. 918335005 nomerga telefon qiling va buyurtmasini to'lang.`;
                    
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Subscription blocked successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: user.blockedMessage }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error blocking subscription:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Unblock subscription
    if (pathname === '/api/admin/unblock-subscription' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone } = JSON.parse(body);
                console.log('\n🔓 UNBLOCK START:', phone);
                
                let user = await dbManager.getUser(phone);
                console.log('📋 User before unblock:', {
                    blocked: user?.blocked,
                    blockStatus: user?.blockStatus,
                    subscriptionActive: user?.subscriptionActive,
                    status: user?.status,
                });
                
                if (user) {
                    // HOZIR TOZALASH VA YANGILASH
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 30);
                    
                    // MUTLAQO HAM TOZALASH
                    user.subscriptionExpiry = expiryDate;
                    user.subscriptionActive = true;        // ✅ ASOSIY!
                    user.blockedMessage = null;
                    user.blocked = false;                   // ✅ ASOSIY!
                    user.blockStatus = null;                // ✅ ASOSIY!
                    user.status = 'FAOL';                   // ✅ ASOSIY!
                    user.approved = true;
                    
                    // QATIY TEKSHIRUV - UNBLOCK AMAL OLDING OLDIN
                    const timeBeforeSave = new Date().getTime();
                    await dbManager.saveUser(phone, user);
                    const timeAfterSave = new Date().getTime();
                    console.log(`⏱️ Save took ${timeAfterSave - timeBeforeSave}ms`);
                    
                    // QAYTA O'QISH - JO'NATILGAN DATA'NI TEKSHIRISH
                    const verifyUser = await dbManager.getUser(phone);
                    console.log('✅ VERIFICATION AFTER UNBLOCK:', {
                        subscriptionActive: verifyUser?.subscriptionActive,
                        blocked: verifyUser?.blocked,
                        blockStatus: verifyUser?.blockStatus,
                        status: verifyUser?.status,
                        expiry: verifyUser?.subscriptionExpiry,
                    });
                    
                    // AGAR HAM HOZIR FALSE BO'LSA - DATABASE MUAMMOSI!
                    if (verifyUser?.subscriptionActive === false) {
                        console.error('🚨 CRITICAL: subscriptionActive still FALSE after unblock!');
                    }
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        verified: verifyUser,
                        beforeSave: user,
                        message: 'User unblocked successfully' 
                    }));
                } else {
                    console.log('❌ User not found:', phone);
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ CRITICAL Error in unblock-subscription:', err.message);
                console.error('Stack:', err.stack);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Update payment info
    if (pathname === '/api/admin/update-payment' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, subscriptionDays, subscriptionExpiry, paidAmount, debtAmount } = JSON.parse(body);
                console.log('💰 Updating payment for:', phone);
                
                const success = await dbManager.updateUser(phone, {
                    subscriptionExpiry,
                    paidAmount,
                    debtAmount,
                    paymentDate: new Date().toISOString()
                });
                
                if (success) {
                    console.log('✅ Payment updated successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to update payment');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Update failed' }));
                }
            } catch (err) {
                console.error('❌ Error updating payment:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Get user by phone (for multi-tab sync)
    if (pathname.startsWith('/api/user/') && req.method === 'GET') {
        try {
            const phone = pathname.replace('/api/user/', '');
            console.log('📱 Getting user data for:', phone);
            
            const user = await dbManager.getUser(phone);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, user }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'User not found' }));
            }
        } catch (err) {
            console.error('❌ Error getting user:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin - Update user (for edit modal)
    if (pathname === '/api/admin/update-user' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                console.log('📝 Updating user:', userData.phone);
                
                const success = await dbManager.saveUser(userData.phone, userData);
                
                if (success) {
                    console.log('✅ User updated successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to update user');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Database update failed' }));
                }
            } catch (err) {
                console.error('❌ Error updating user:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Send message to user
    if (pathname === '/api/admin/send-message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, message, from } = JSON.parse(body);
                console.log('💬 Sending message to:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (!user.adminMessages) {
                        user.adminMessages = [];
                    }
                    user.adminMessages.push({
                        from: from || 'ADMIN',
                        message,
                        timestamp: new Date().toISOString()
                    });
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Message sent successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error sending message:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save settings
    if (pathname === '/api/save-settings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, name, settings } = JSON.parse(body);
                console.log('💾 Saving settings to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (name) user.name = name;
                    user.settings = settings;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Settings saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving settings:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save school data
    if (pathname === '/api/save-school' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, schoolCode, schoolSchedule, weeklySchedule } = JSON.parse(body);
                console.log('💾 Saving school data to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (schoolCode) user.schoolCode = schoolCode;
                    if (schoolSchedule) user.schoolSchedule = schoolSchedule;
                    if (weeklySchedule) user.weeklySchedule = weeklySchedule;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ School data saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving school data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save work data
    if (pathname === '/api/save-work' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, workCode, workDaily } = JSON.parse(body);
                console.log('💾 Saving work data to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (workCode) user.workCode = workCode;
                    if (workDaily) user.workDaily = workDaily;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Work data saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving work data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save plan code
    if (pathname === '/api/save-plan-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, planCode } = JSON.parse(body);
                console.log('💾 Saving plan code to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.planCode = planCode;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Plan code saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving plan code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin change user code
    if (pathname === '/api/admin/change-user-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, codeType, newCode } = JSON.parse(body);
                console.log('🔑 Admin changing code for:', phone, 'Type:', codeType);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (codeType === 'work') {
                        user.workCode = newCode;
                    } else if (codeType === 'school') {
                        user.schoolCode = newCode;
                    } else if (codeType === 'plan') {
                        user.planCode = newCode;
                    }
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Code changed successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error changing code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save video maslahat chat
    if (pathname === '/api/save-video-chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, chatHistory } = JSON.parse(body);
                console.log('💾 Saving video chat to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.videoChat = chatHistory;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Video chat saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving video chat:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save morning exercises
    if (pathname === '/api/save-morning' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, morning } = JSON.parse(body);
                console.log('💾 Saving morning exercises to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.morning = morning;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Morning exercises saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving morning exercises:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save evening exercises
    if (pathname === '/api/save-evening' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, evening } = JSON.parse(body);
                console.log('💾 Saving evening exercises to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.evening = evening;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Evening exercises saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving evening exercises:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save goals
    if (pathname === '/api/save-goals' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, futureGoals } = JSON.parse(body);
                console.log('💾 Saving goals to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.futureGoals = futureGoals;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Goals saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving goals:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save goals code
    if (pathname === '/api/save-goals-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, goalsCode } = JSON.parse(body);
                console.log('🔐 Saving goals code for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.goalsCode = goalsCode;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Goals code saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving goals code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save plans
    if (pathname === '/api/save-plans' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, plans } = JSON.parse(body);
                console.log('💾 Saving plans to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.plans = plans;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Plans saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving plans:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save sport goal
    if (pathname === '/api/save-sport-goal' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, sportGoal, currentLevel } = JSON.parse(body);
                console.log('💾 Saving sport goal for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.sportGoal = sportGoal;
                    user.currentLevel = currentLevel;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Sport goal saved');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save sport type
    if (pathname === '/api/save-sport-type' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, sportType, period } = JSON.parse(body);
                console.log('💾 Saving sport type for:', phone, '| Period:', period);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.sportType = sportType;
                    user.sportPeriod = period;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Sport type saved');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save morning exercises
    if (pathname === '/api/save-morning-exercises' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, morningExercises } = JSON.parse(body);
                console.log('💾 Saving morning exercises for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.morningExercises = morningExercises;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Morning exercises saved');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save evening exercises
    if (pathname === '/api/save-evening-exercises' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, eveningExercises } = JSON.parse(body);
                console.log('💾 Saving evening exercises for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.eveningExercises = eveningExercises;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Evening exercises saved');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save weekly schedule
    if (pathname === '/api/save-weekly-schedule' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, weeklySchedule } = JSON.parse(body);
                console.log('💾 Saving weekly schedule for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.weeklySchedule = weeklySchedule;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Weekly schedule saved');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save nutrition
    if (pathname === '/api/save-nutrition' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, nutrition, nutritionChat } = JSON.parse(body);
                console.log('💾 Saving nutrition for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (nutrition) user.nutrition = nutrition;
                    if (nutritionChat) user.nutritionChat = nutritionChat;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Nutrition saved');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Nutrition Chat with Gemini (legacy - kept for compatibility)
    if (pathname === '/api/nutrition-chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { message, userAge, userWeight, userHeight, userGoal, apiKey } = JSON.parse(body);
                console.log('🤖 Gemini nutrition chat:', message);
                
                if (!apiKey) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'API key required' }));
                    return;
                }

                // Tayyorlash
                const prompt = `Siz ovqatlanish va sog'liq maslahat beradigan expert AI assistent siz. 
Foydalanuvchi ma'lumotlari:
- Yosh: ${userAge}
- Vazn: ${userWeight} kg
- Bo'y: ${userHeight} cm
- Maqsad: ${userGoal}

Foydalanuvchi savoli: "${message}"

Javobda:
1. Savolgа to'g'ri javob bering
2. Shaxsiy ma'lumotlarni hisobga oling
3. Sog'liqqa E'tibor bering
4. Ozbekcha javob bering
5. Qisqacha va foydali ma'lumot bering`;

                const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: prompt }
                                ]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        }
                    })
                });

                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    console.log('✅ Gemini response received');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, response: aiResponse }));
                } else {
                    console.error('❌ Gemini error:', data);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: data.error?.message || 'Gemini API error' }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save daily schedule
    if (pathname === '/api/save-daily-schedule' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, dailySchedule } = JSON.parse(body);
                console.log('💾 Saving daily schedule to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.dailySchedule = dailySchedule;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Daily schedule saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving daily schedule:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save schedule history
    if (pathname === '/api/save-schedule-history' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, scheduleHistory, dailySchedule } = JSON.parse(body);
                console.log('💾 Saving schedule history to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.scheduleHistory = scheduleHistory;
                    user.dailySchedule = dailySchedule;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Schedule history saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving schedule history:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save schedule
    if (pathname === '/api/save-schedule' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, schedule } = JSON.parse(body);
                console.log('💾 Saving schedule to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.schedule = schedule;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Schedule saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving schedule:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin Chat - Update messages (edit/delete) - MUST BE BEFORE GET endpoint
    if (pathname === '/api/admin-chat/update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, messages } = JSON.parse(body);
                console.log('📝 Updating chat messages for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.chatMessages = messages;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Chat messages updated');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Update error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin Chat - Get messages (MUST BE BEFORE /send endpoint)
    if (pathname.startsWith('/api/admin-chat/') && pathname !== '/api/admin-chat/send' && pathname !== '/api/admin-chat/update' && req.method === 'GET') {
        try {
            let phone = pathname.replace('/api/admin-chat/', '');
            phone = decodeURIComponent(phone);
            console.log('📨 Getting chat for:', phone);
            const user = await dbManager.getUser(phone);
            if (user) {
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, messages: user.chatMessages || [] }));
            } else {
                res.writeHead(404, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: 'User not found' }));
            }
        } catch (err) {
            console.error('❌ Error getting chat:', err);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin Chat - Send message
    if (pathname === '/api/admin-chat/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, name, message, role } = JSON.parse(body);
                console.log('💬 Chat message from:', name, '(' + phone + ')');
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (!user.chatMessages) user.chatMessages = [];
                    user.chatMessages.push({
                        role: role || 'user',
                        message,
                        timestamp: new Date()
                    });
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Chat message saved');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Chat error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin Chat - Update messages (edit/delete)
    if (pathname === '/api/admin-chat/update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, messages } = JSON.parse(body);
                console.log('📝 Updating chat messages for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.chatMessages = messages;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Chat messages updated');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Update error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Get chat users
    if (pathname === '/api/admin/chat-users' && req.method === 'GET') {
        try {
            const users = await dbManager.getAllUsers();
            const chatUsers = users
                .filter(u => {
                    // O'chirilgan foydalanuvchilarni ko'rsatmaslik
                    if (u.deleted) return false;
                    
                    // Chat xabarlari bo'lishi kerak
                    if (!u.chatMessages || u.chatMessages.length === 0) return false;
                    
                    // Kamida bitta o'qilmagan xabar bo'lishi kerak
                    const hasUnreadMessages = u.chatMessages.some(m => m.role === 'user' && !m.read);
                    return hasUnreadMessages;
                })
                .map(u => ({
                    phone: u.phone,
                    name: u.name,
                    unreadCount: u.chatMessages.filter(m => m.role === 'user' && !m.read).length
                }));
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, users: chatUsers }));
        } catch (err) {
            console.error('❌ Error getting chat users:', err);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Save AI insights
    if (pathname === '/api/save-insights' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, insights } = JSON.parse(body);
                console.log('💾 Saving AI insights to MongoDB for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.insights = insights;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ AI insights saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving AI insights:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Migrate users (add planCode to users without it)
    if (pathname === '/api/admin/migrate-plan-codes' && req.method === 'POST') {
        try {
            const users = await dbManager.getAllUsers();
            let migratedCount = 0;
            
            for (const user of users) {
                if (!user.planCode) {
                    user.planCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    await dbManager.saveUser(user.phone, user);
                    migratedCount++;
                    console.log(`✅ Migrated user ${user.phone} with planCode: ${user.planCode}`);
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, migratedCount }));
        } catch (err) {
            console.error('❌ Migration error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin - Update plan code
    if (pathname === '/api/admin/update-plan-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, planCode } = JSON.parse(body);
                console.log('🔑 Updating plan code for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.planCode = planCode;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Plan code updated successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error updating plan code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Set work code
    if (pathname === '/api/set-work-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, code } = JSON.parse(body);
                console.log('💾 Setting work code for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.workCode = code;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Work code set successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error setting work code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save work info
    if (pathname === '/api/save-work-info' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, workInfo } = JSON.parse(body);
                console.log('💾 Saving work info for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.workInfo = workInfo;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Work info saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving work info:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Save today tasks
    if (pathname === '/api/save-today-tasks' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, tasks } = JSON.parse(body);
                console.log('💾 Saving today tasks for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    user.todayTasks = tasks;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Today tasks saved successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error saving today tasks:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Change work code
    if (pathname === '/api/change-work-code' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { phone, oldCode, newCode } = JSON.parse(body);
                console.log('💾 Changing work code for:', phone);
                
                const user = await dbManager.getUser(phone);
                if (user) {
                    if (user.workCode !== oldCode) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Eski kod noto\'g\'ri' }));
                        return;
                    }
                    
                    user.workCode = newCode;
                    await dbManager.saveUser(phone, user);
                    console.log('✅ Work code changed successfully');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'User not found' }));
                }
            } catch (err) {
                console.error('❌ Error changing work code:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Get Gemini API key
    if (pathname === '/api/admin/get-api-key' && req.method === 'GET') {
        try {
            const settings = await dbManager.getPriceSettings();
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                success: true, 
                apiKey: settings?.geminiApiKey || settings?.openaiApiKey || ''
            }));
        } catch (err) {
            console.error('❌ Error getting API key:', err);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Admin - Save Gemini API key
    if (pathname === '/api/admin/save-api-key' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { apiKey } = JSON.parse(body);
                console.log('💾 Saving Gemini API key');
                
                const success = await dbManager.savePriceSetting('geminiApiKey', apiKey);
                
                if (success) {
                    console.log('✅ Gemini API key saved successfully');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save Gemini API key');
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving API key:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Test Gemini API key
    if (pathname === '/api/admin/test-api-key' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { apiKey } = JSON.parse(body);
                console.log('🧪 Testing Gemini API key');
                
                const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: 'Test' }]
                        }]
                    })
                });

                const data = await response.json();
                
                if (response.ok && data.candidates) {
                    console.log('✅ Gemini API key is valid');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.error('❌ Gemini API key test failed:', data);
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: data.error?.message || 'Invalid API key' 
                    }));
                }
            } catch (err) {
                console.error('❌ Error testing API key:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Save monthly price
    if (pathname === '/api/admin/save-monthly-price' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { price } = JSON.parse(body);
                console.log('💰 Saving monthly price:', price);
                
                const success = await dbManager.savePriceSetting('monthlyPrice', price);
                
                if (success) {
                    console.log('✅ Monthly price saved successfully');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    console.log('❌ Failed to save monthly price');
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Database save failed' }));
                }
            } catch (err) {
                console.error('❌ Error saving monthly price:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Admin - Get monthly price
    if (pathname === '/api/admin/get-monthly-price' && req.method === 'GET') {
        try {
            const settings = await dbManager.getPriceSettings();
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                success: true, 
                price: settings?.monthlyPrice || 0
            }));
        } catch (err) {
            console.error('❌ Error getting monthly price:', err);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: AI Chat with Gemini (for all users) - BEPUL!
    if (pathname === '/api/ai-chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { message, userAge, userWeight, userHeight, userGoal } = JSON.parse(body);
                console.log('🤖 Gemini nutrition chat:', message);
                
                // Get admin's API key from settings
                const settings = await dbManager.getPriceSettings();
                const apiKey = settings?.geminiApiKey || settings?.openaiApiKey;
                
                if (!apiKey) {
                    res.writeHead(400, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Admin API key not configured' 
                    }));
                    return;
                }

                // Prepare prompt
                const prompt = `Siz ovqatlanish va sog'liq maslahat beradigan expert AI assistent siz. 
Foydalanuvchi ma'lumotlari:
- Yosh: ${userAge}
- Vazn: ${userWeight} kg
- Bo'y: ${userHeight} cm
- Maqsad: ${userGoal}

Foydalanuvchi savoli: "${message}"

Javobda:
1. Savolgа to'g'ri javob bering
2. Shaxsiy ma'lumotlarni hisobga oling
3. Sog'liqqa E'tibor bering
4. O'zbekcha javob bering
5. Qisqacha va foydali ma'lumot bering`;

                const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        }
                    })
                });

                const data = await response.json();
                
                console.log('📥 Gemini API response status:', response.status);
                console.log('📥 Gemini API response data:', JSON.stringify(data).substring(0, 200));
                
                if (response.ok && data.candidates && data.candidates[0]) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    console.log('✅ Gemini response received');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true, response: aiResponse }));
                } else {
                    console.error('❌ Gemini error:', data);
                    
                    // Better error message in Uzbek
                    let errorMsg = 'Gemini API xatosi';
                    if (data.error?.message) {
                        const msg = data.error.message;
                        if (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID')) {
                            errorMsg = '❌ API key noto\'g\'ri!\n\n📝 Admin qilishi kerak:\n1. https://aistudio.google.com/apikey ga kiring\n2. Yangi API key yarating\n3. "API SOZLAMALARI" tabida yangi key ni kiriting';
                        } else if (msg.includes('PERMISSION_DENIED')) {
                            errorMsg = '❌ API key ruxsati yo\'q. Admin yangi API key yaratishi kerak.';
                        } else if (msg.includes('QUOTA_EXCEEDED')) {
                            errorMsg = '❌ API limit tugadi. Admin yangi API key yaratishi kerak.';
                        } else {
                            errorMsg = `❌ Xato: ${msg}`;
                        }
                    }
                    
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: errorMsg
                    }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(500, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: AI Goal Advice - Maqsad uchun shaxsiy maslahat
    if (pathname === '/api/ai-goal-advice' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { userInfo } = JSON.parse(body);
                console.log('🎯 AI Goal Advice for:', userInfo.goal);
                
                // Get admin's API key
                const settings = await dbManager.getPriceSettings();
                const apiKey = settings?.geminiApiKey || settings?.openaiApiKey;
                
                if (!apiKey) {
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: true, 
                        advice: '⚠️ Admin API key sozlamagan. API SOZLAMALARI tabidan API key kiriting.' 
                    }));
                    return;
                }

                // Prepare detailed prompt
                const prompt = `Siz professional sport murabbiy va hayot maslahatchi siz. Foydalanuvchining maqsadini ko'rib, ANIQ va AMALIY maslahat bering.

📊 FOYDALANUVCHI MA'LUMOTLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MAQSAD: ${userInfo.goal}
👤 Jins: ${userInfo.gender || 'Kiritilmagan'}
📅 Yosh: ${userInfo.age || 'Kiritilmagan'}
⚖️ Vazn: ${userInfo.weight ? userInfo.weight + ' kg' : 'Kiritilmagan'}
📏 Bo'y: ${userInfo.height ? userInfo.height + ' cm' : 'Kiritilmagan'}
💼 Turi: ${userInfo.userType || 'Kiritilmagan'}
🏋️ Sport chastotasi: ${userInfo.sportFrequency || 'Kiritilmagan'}
🎾 Sport turi: ${userInfo.sportType || 'Kiritilmagan'}

📋 KUNLIK TARTIB: ${Object.keys(userInfo.schedule || {}).length > 0 ? 'Mavjud' : 'Hali kiritilmagan'}
🍽️ OVQATLANISH: ${Object.keys(userInfo.nutrition || {}).length > 0 ? 'Mavjud' : 'Hali kiritilmagan'}
💼 ISH JADVALI: ${Object.keys(userInfo.workSchedule || {}).length > 0 ? 'Mavjud' : 'Hali kiritilmagan'}
📚 MAKTAB JADVALI: ${Object.keys(userInfo.schoolSchedule || {}).length > 0 ? 'Mavjud' : 'Hali kiritilmagan'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUHIM: Agar ma'lumotlar kiritilmagan bo'lsa ham, maqsadga qarab BATAFSIL maslahat bering!

VAZIFA: Quyidagi formatda BATAFSIL va AMALIY maslahat bering:

🎯 MAQSAD TAHLILI
- Maqsad real yoki yo'qligini baholang
- Qancha vaqt kerakligini aytib bering
- Bosqichma-bosqich reja tuzing

💪 SPORT MASLAHATLARI (JUDA MUHIM!)
- Maqsadga erishish uchun ANIQ mashqlar ro'yxati
- Har bir mashqni necha marta va necha set bajarish kerak
- Qachon mashq qilish kerak (ertalab/kechqurun)
- Haftalik jadval (dushanba, seshanba va h.k.)
- Boshlang'ich, o'rta va yuqori darajalar uchun alohida maslahat
- Jinsga mos mashqlar (erkak/ayol)

🍽️ OVQATLANISH MASLAHATLARI
- Maqsadga mos ovqatlar ro'yxati
- Kunlik kalloriya va protein miqdori
- Nonushta, tushlik, kechki ovqat uchun aniq tavsiyalar
- Qanday ovqatlardan qochish kerak

⏰ KUNLIK TARTIB MASLAHATLARI
- Soat bo'yicha jadval (06:00, 07:00 va h.k.)
- Uyqu, ish, sport, dam olish vaqtlari
- Optimal tartib

📈 MUVAFFAQIYAT STRATEGIYASI
- Motivatsiya va qo'llab-quvvatlash
- Qanday qilib davom ettirish mumkin
- Natijalarni qanday o'lchash kerak

⚠️ MUHIM OGOHLANTIRISHLAR
- Sog'liq va xavfsizlik
- Haddan oshmaslik haqida
- Shifokor bilan maslahatlashish kerak bo'lgan holatlar

ESLATMA: 
- O'zbek tilida yozing
- Aniq raqamlar va vaqtlar bering (masalan: "20 ta turnik, 3 set, ertalab 7:00 da")
- Amaliy va bajarilishi mumkin bo'lgan maslahatlar bering
- Agar ma'lumot yetarli bo'lmasa, umumiy lekin foydali maslahatlar bering
- Maqsadga to'g'ridan-to'g'ri mos keladigan maslahatlar bering

ESLATMA: 
- O'zbek tilida yozing
- Aniq raqamlar va vaqtlar bering
- Amaliy va bajarilishi mumkin bo'lgan maslahatlar bering
- Foydalanuvchining hozirgi holatini hisobga oling
- Agar ma'lumot yetarli bo'lmasa, umumiy maslahatlar bering`;

                const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2048
                        }
                    })
                });

                const data = await response.json();
                
                if (response.ok && data.candidates && data.candidates[0]) {
                    const advice = data.candidates[0].content.parts[0].text;
                    console.log('✅ AI advice generated');
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: true, advice }));
                } else {
                    console.error('❌ Gemini error:', data);
                    res.writeHead(200, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        success: true, 
                        advice: '⚠️ AI maslahat olishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring yoki Admin bilan bog\'laning.' 
                    }));
                }
            } catch (err) {
                console.error('❌ Error:', err);
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    advice: '⚠️ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.' 
                }));
            }
        });
        return;
    }

    // Catch-all for unhandled API paths
    if (pathname.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }));
        return;
    }

    // Security: Block unwanted files (but allow service-worker.js and manifest.json)
    if (pathname.includes('main.jsx') || 
        pathname.includes('@react-refresh') ||
        pathname.includes('client') ||
        (pathname.includes('node_modules') && !pathname.includes('service-worker') && !pathname.includes('manifest'))) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    // Default to nuraziz-complete-v2.html
    if (pathname === '/' || pathname === '') {
        pathname = '/nuraziz-complete-v2.html';
    }

    // Favicon - ignore
    if (pathname === '/favicon.ico') {
        res.writeHead(204, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
    }

    // Remove leading slash
    let filename = pathname.startsWith('/') ? pathname.slice(1) : pathname;

    // Security: Only allow specific files
    if (!allowedFiles.includes(filename)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Not Found</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
                    h1 { color: #e74c3c; }
                    a { color: #3498db; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>404 - File Not Found</h1>
                <p>The file "${pathname}" was not found.</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
        `);
        return;
    }

    // Build file path
    const filePath = path.join(__dirname, filename);

    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found: ' + filename);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: ' + err.message);
            }
        } else {
            // Add CORS headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(data);
        }
    });
});

// Start server
server.listen(PORT, HOST, () => {
    const url = `http://${HOST}:${PORT}`;
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🏋️  ATHLETIC PERFORMANCE COACH - LOCAL SERVER        ║
║                                                            ║
║     ✅ Server running at: ${url}              ║
║                                                            ║
║     📱 Opening browser...                                 ║
║                                                            ║
║     Press Ctrl+C to stop server                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
    
    // Auto-open browser
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
        // Windows: use start with empty title to avoid issues
        command = `start "" "${url}"`;
    } else if (platform === 'darwin') {
        command = `open ${url}`;
    } else {
        command = `xdg-open ${url}`;
    }
    
    exec(command, (err) => {
        if (err) {
            console.log(`⚠️  Could not auto-open browser. Please visit: ${url}`);
        } else {
            console.log(`✅ Browser opened automatically!`);
        }
    });
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use!`);
        console.error('Try a different port or kill the process using this port.\n');
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped\n');
        process.exit(0);
    });
});
