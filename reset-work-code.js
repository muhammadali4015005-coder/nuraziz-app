// Reset work code for testing first-time setup
import dbManager from './db-manager.js';

async function resetWorkCode() {
  const phone = '+998901234567'; // Demo user
  
  try {
    await dbManager.connect();
    console.log('✅ MongoDB ga ulandi');
    
    const user = await dbManager.getUser(phone);
    if (user) {
      // Remove work code
      delete user.workCode;
      delete user.workDaily;
      
      await dbManager.saveUser(phone, user);
      console.log('✅ Work code o\'chirildi:', phone);
      console.log('Endi Ish tabiga kirganingizda kod o\'rnatish ekrani ko\'rsatiladi');
    } else {
      console.log('❌ Foydalanuvchi topilmadi:', phone);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Xato:', err);
    process.exit(1);
  }
}

resetWorkCode();
