// Set demo user to work type
import dbManager from './db-manager.js';

async function setDemoWork() {
  const phone = '+998901234567'; // Demo user
  
  try {
    await dbManager.connect();
    console.log('✅ MongoDB ga ulandi');
    
    const user = await dbManager.getUser(phone);
    if (user) {
      // Set user type to work
      if (!user.settings) {
        user.settings = {};
      }
      user.settings.userType = 'work';
      user.settings.workType = 'Test Ish';
      user.settings.workPosition = 'Ishchi';
      
      await dbManager.saveUser(phone, user);
      console.log('✅ Demo user uchun userType = work o\'rnatildi');
      console.log('Endi Ish tabi burger menyuda ko\'rsatiladi');
    } else {
      console.log('❌ Foydalanuvchi topilmadi:', phone);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Xato:', err);
    process.exit(1);
  }
}

setDemoWork();
