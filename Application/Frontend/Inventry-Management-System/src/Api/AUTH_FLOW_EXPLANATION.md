/**
 * AUTHENTICATION & TOKEN FLOW
 * ==========================
 * 
 * اگنتھیکیشن کے دو مختلف flows ہیں:
 * 
 * 1. SIGNUP (نیا صارف): ❌ TOKEN نہیں چاہیے
 *    - مثال: /api/account/SignUp
 *    - یہ PUBLIC endpoint ہے
 *    - کوئی بھی اس کو access کر سکتا ہے
 *    - Token نہیں بھیجتے
 *    - نیا صارف create ہوتا ہے
 *    
 * 2. LOGIN: ✅ توثیق اور TOKEN ملتا ہے
 *    - مثال: /api/account/SignIn
 *    - Email اور Password بھیجتے ہیں
 *    - Backend واپس accessToken + refreshToken بھیجتا ہے
 *    - یہ tokens localStorage میں save ہوتے ہیں
 *    
 * 3. AUTHORIZED OPERATIONS: ✅ TOKEN ضروری ہے
 *    - مثال: /api/user/createUser (admin صرف)
 *    - /api/user/getAllUsers
 *    - /api/user/updateuser/:id
 *    - /api/user/deleteuser/:id
 *    - ہر request میں header میں Bearer token بھیجتے ہیں:
 *      Authorization: Bearer <accessToken>
 * 
 * 4. TOKEN REFRESH:
 *    - اگر accessToken expire ہو جائے (401 error)
 *    - refreshToken استعمال کر کے نیا accessToken لیتے ہیں
 *    - /api/account/refresh endpoint کو call کرتے ہیں
 * 
 * 5. LOGOUT:
 *    - تمام tokens localStorage سے delete ہوتے ہیں
 *    - User /signin پر redirect ہوتا ہے
 * 
 * ENDPOINTS:
 * ----------
 * PUBLIC (کوئی token نہیں):
 *   POST   /api/account/SignUp    - نیا صارف رجسٹر کریں
 *   POST   /api/account/SignIn    - login کریں (token ملتا ہے)
 * 
 * PROTECTED (token ضروری):
 *   POST   /api/user/createUser   - نیا صارف بنائیں (admin)
 *   GET    /api/user/getAllUsers  - تمام صارفین دیکھیں
 *   PUT    /api/user/updateuser/:id - صارف update کریں (admin)
 *   DELETE /api/user/deleteuser/:id - صارف delete کریں (admin)
 * 
 * TOKEN REFRESH:
 *   POST   /api/account/refresh   - نیا accessToken لیں
 * 
 * LOGOUT:
 *   POST   /api/account/logOut    - logout کریں
 */

export const authFlowExplanation = `
KEY POINTS:
===========

1. نیا صارف بنانے کے لیے (Sign Up):
   ❌ token نہیں چاہیے
   ✅ صرف email, password, name بھیجتے ہیں
   
2. لاگ ان کرنے کے لیے (Sign In):
   ❌ token نہیں چاہیے
   ✅ email اور password بھیجتے ہیں
   ✅ جواب میں accessToken ملتا ہے
   
3. صارفین کو manage کرنے کے لیے (Create/Update/Delete):
   ✅ token ضروری ہے
   ✅ اور صارف admin ہونا چاہیے
   ✅ header میں Bearer token بھیجتے ہیں
`;
