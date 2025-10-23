// Quick configuration verification script
// Run with: node verify-config.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Reel-Style-Food-App Configuration...\n');

let hasErrors = false;

// Check Backend .env.example
console.log('📋 Checking Backend configuration...');
const backendEnvExample = path.join(__dirname, 'Backend', '.env.example');
if (fs.existsSync(backendEnvExample)) {
    const content = fs.readFileSync(backendEnvExample, 'utf8');
    if (content.includes('CLIENT_ORIGINS')) {
        console.log('  ✅ Backend .env.example has CLIENT_ORIGINS');
    } else {
        console.log('  ⚠️  Backend .env.example missing CLIENT_ORIGINS');
        hasErrors = true;
    }
} else {
    console.log('  ❌ Backend .env.example not found');
    hasErrors = true;
}

// Check Frontend .env.production
console.log('\n📋 Checking Frontend configuration...');
const frontendEnvProd = path.join(__dirname, 'Frontend', '.env.production');
if (fs.existsSync(frontendEnvProd)) {
    const content = fs.readFileSync(frontendEnvProd, 'utf8');
    if (content.includes('VITE_API_URL')) {
        const match = content.match(/VITE_API_URL=(.+)/);
        if (match) {
            const url = match[1].trim();
            console.log(`  ✅ VITE_API_URL is set to: ${url}`);
            if (url.includes('localhost')) {
                console.log('  ⚠️  Warning: VITE_API_URL points to localhost');
            }
        }
    } else {
        console.log('  ❌ VITE_API_URL not found in .env.production');
        hasErrors = true;
    }
} else {
    console.log('  ❌ Frontend .env.production not found');
    hasErrors = true;
}

// Check render.yaml
console.log('\n📋 Checking render.yaml...');
const renderYaml = path.join(__dirname, 'render.yaml');
if (fs.existsSync(renderYaml)) {
    const content = fs.readFileSync(renderYaml, 'utf8');
    if (content.includes('type: rewrite')) {
        console.log('  ✅ SPA rewrite rule configured');
    } else {
        console.log('  ⚠️  SPA rewrite rule might be missing');
    }
    if (content.includes('Cache-Control')) {
        console.log('  ✅ Cache headers configured');
    }
} else {
    console.log('  ⚠️  render.yaml not found (optional)');
}

// Check for PartnerPrivateRoute
console.log('\n📋 Checking route protection...');
const partnerPrivateRoute = path.join(__dirname, 'Frontend', 'src', 'shared', 'components', 'auth', 'PartnerPrivateRoute.jsx');
if (fs.existsSync(partnerPrivateRoute)) {
    console.log('  ✅ PartnerPrivateRoute component exists');
} else {
    console.log('  ❌ PartnerPrivateRoute component not found');
    hasErrors = true;
}

// Check AppRouter
const appRouter = path.join(__dirname, 'Frontend', 'src', 'routes', 'AppRouter.jsx');
if (fs.existsSync(appRouter)) {
    const content = fs.readFileSync(appRouter, 'utf8');
    if (content.includes('PartnerPrivateRoute')) {
        console.log('  ✅ AppRouter imports PartnerPrivateRoute');
    } else {
        console.log('  ❌ AppRouter does not import PartnerPrivateRoute');
        hasErrors = true;
    }
} else {
    console.log('  ❌ AppRouter.jsx not found');
    hasErrors = true;
}

// Check Backend app.js for CORS fix
console.log('\n📋 Checking Backend CORS configuration...');
const backendApp = path.join(__dirname, 'Backend', 'src', 'app.js');
if (fs.existsSync(backendApp)) {
    const content = fs.readFileSync(backendApp, 'utf8');
    if (content.includes('x-csrf-token')) {
        console.log('  ✅ CORS allows x-csrf-token header');
    } else {
        console.log('  ❌ CORS missing x-csrf-token in allowedHeaders');
        hasErrors = true;
    }
    if (content.includes('CLIENT_ORIGINS') || content.includes('FRONTEND_ORIGINS')) {
        console.log('  ✅ CORS origin configuration found');
    } else {
        console.log('  ❌ CORS origin configuration missing');
        hasErrors = true;
    }
} else {
    console.log('  ❌ Backend app.js not found');
    hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Configuration has issues that need to be fixed');
    console.log('\nRefer to FIXES_APPLIED.md for details on required changes.');
    process.exit(1);
} else {
    console.log('✅ All configuration checks passed!');
    console.log('\nNext steps:');
    console.log('1. Set environment variables in Render dashboard');
    console.log('2. Deploy backend and frontend');
    console.log('3. Test using the checklist in FIXES_APPLIED.md');
    process.exit(0);
}
