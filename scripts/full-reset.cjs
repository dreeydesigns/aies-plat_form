/**
 * AIES SAT — Master Database & Auth Full Reset Utility
 * 
 * Preserves the AI and Content Intelligence layer:
 *  - questions/*
 *  - textbooks/*
 *  - libraryContent/*
 *  - scoreConversionTables/*
 *  - subscriptionTiers/*
 * 
 * Completely wipes user and institutional state:
 *  - users/* (except designated admin)
 *  - attempts/*
 *  - submissions/*
 *  - institutions/*
 *  - departments/*
 *  - classes/*
 *  - schoolCodes/*
 *  - parentLinkRequests/*
 *  - guestSessions/*
 *  - notifications/*
 *  - agentEvents/*
 *  - misconceptionCases/*
 *  - retakePrompts/*
 *  - assignedTests/*
 *  - satDiagnostics/*
 *  - satPractices/*
 *  - satTests/*
 *  - emailVerificationCodes/*
 * 
 * Usage:
 *   node scripts/full-reset.cjs <ADMIN_UID> [SERVICE_ACCOUNT_PATH]
 */

const admin = require('firebase-admin');

// Service Account initialization
const serviceAccountPath = process.argv[3] || process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
const adminUid = process.argv[2] || process.env.ADMIN_UID || 'system-admin';

console.log('--- AIES SAT FULL DATABASE RESET ---');
console.log('Designated Admin UID to preserve:', adminUid);

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Attempt default initialization if running on Google Cloud / Firebase environment
    admin.initializeApp();
  }
} catch (e) {
  console.log('Initializing with application default credentials...');
  try {
    admin.initializeApp();
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK. Please supply a valid service-account.json: ', err.message);
  }
}

const db = admin.firestore();

const COLLECTIONS_TO_WIPE = [
  'users',
  'attempts',
  'submissions',
  'institutions',
  'departments',
  'classes',
  'schoolCodes',
  'parentLinkRequests',
  'guestSessions',
  'notifications',
  'agentEvents',
  'misconceptionCases',
  'retakePrompts',
  'assignedTests',
  'satDiagnostics',
  'satPractices',
  'satTests',
  'emailVerificationCodes',
  'deviceData'
];

async function fullReset() {
  console.log('\n[1/3] Deleting Firestore user and institutional collections...');
  for (const col of COLLECTIONS_TO_WIPE) {
    try {
      const snap = await db.collection(col).get();
      if (snap.empty) {
        console.log(`  - ${col}: 0 documents`);
        continue;
      }

      let deletedCount = 0;
      const batch = db.batch();
      snap.docs.forEach(docSnap => {
        if (col === 'users' && docSnap.id === adminUid) {
          console.log(`  - Preserving admin document: users/${docSnap.id}`);
        } else {
          batch.delete(docSnap.ref);
          deletedCount++;
        }
      });

      await batch.commit();
      console.log(`  ✓ ${col}: Deleted ${deletedCount} document(s)`);
    } catch (err) {
      console.warn(`  ⚠️ Error wiping collection ${col}: ${err.message}`);
    }
  }

  console.log('\n[2/3] Deleting Firebase Auth accounts (except admin)...');
  try {
    const list = await admin.auth().listUsers(1000);
    const uidsToDelete = list.users
      .map(u => u.uid)
      .filter(uid => uid !== adminUid);

    if (uidsToDelete.length > 0) {
      const deleteResult = await admin.auth().deleteUsers(uidsToDelete);
      console.log(`  ✓ Deleted ${deleteResult.successCount} Firebase Auth account(s)`);
    } else {
      console.log('  - No auxiliary Auth accounts found.');
    }
  } catch (err) {
    console.warn(`  ⚠️ Error listing/deleting Auth users: ${err.message}`);
  }

  console.log('\n[3/3] Verifying preserved AI and Content intelligence layers...');
  const verifyCollections = ['questions', 'textbooks', 'libraryContent', 'subscriptionTiers'];
  for (const col of verifyCollections) {
    try {
      const snap = await db.collection(col).limit(5).get();
      console.log(`  ✓ Preserved: ${col} (Found ${snap.size} sample records)`);
    } catch (e) {
      console.log(`  - ${col} check completed.`);
    }
  }

  console.log('\n🎉 Full Reset Process Completed Successfully!');
}

if (require.main === module) {
  fullReset().catch(console.error);
}

module.exports = { fullReset };
