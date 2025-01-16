import express from 'express';
import playwright from 'playwright';

const router = express.Router();

// 사이트 정보 찾기 함수 
async function findSiteInfo(url) {
   const browser = await playwright.chromium.launch({
       headless: true,
       args: ['--no-sandbox']
   });

   try {
       const page = await browser.newPage();
       console.log('크롤링 시작:', url);
       await page.goto(url);

       // 기존 evaluate 코드 유지
       const siteInfo = await page.evaluate(() => {
           // ... (기존 코드 동일)
       });

       console.log('찾은 정보:', siteInfo);
       return siteInfo;

   } catch (error) {
       console.error('크롤링 에러:', error);
       throw error;
   } finally {
       await browser.close();
   }
}

// 가격 정보 찾기 함수
async function findPricingInfo(url) {
   const browser = await playwright.chromium.launch({
       headless: true, 
       args: ['--no-sandbox']
   });

   try {
       const page = await browser.newPage();
       console.log('가격 정보 크롤링 시작:', url);
       
       // 기존 코드 동일
       await page.goto(url, {
           waitUntil: 'networkidle',
           timeout: 30000
       });

       await page.waitForTimeout(2000);

       const pricingInfo = await page.evaluate(() => {
           // ... (기존 코드 동일)
       });

       console.log('찾은 가격 정보:', pricingInfo);
       return pricingInfo;

   } catch (error) {
       console.error('가격 정보 크롤링 에러:', error); 
       throw error;
   } finally {
       await browser.close();
   }
}

// 사이트 정보찾기 라우트
router.get('/find-site-info', async (req, res) => {
   try {
       const { url } = req.query;
       console.log('요청받은 URL:', url);

       if (!url) {
           return res.status(400).json({
               success: false,
               error: 'URL이 필요합니다.'
           });
       }

       const siteInfo = await findSiteInfo(url);

       if (!siteInfo) {
           return res.status(404).json({
               success: false, 
               error: '사이트 정보를 찾을 수 없습니다.'
           });
       }

       res.json({
           success: true,
           siteInfo
       });

   } catch (error) {
       console.error('크롤링 중 에러 발생:', error);
       res.status(500).json({
           success: false,
           error: error.message
       });
   }
});

// 가격찾기 라우트 
router.get('/find-pricing', async (req, res) => {
   try {
       let { url } = req.query;
       
       if (!url) {
           return res.status(400).json({
               success: false,
               error: 'URL이 필요합니다.'
           });
       }

       url = `${url.replace(/\/$/, '')}/pricing`;

       const pricingInfo = await findPricingInfo(url);
       
       if (!pricingInfo || !pricingInfo.plans.length) {
           return res.status(404).json({
               success: false,
               error: '가격 정보를 찾을 수 없습니다.'
           });
       }

       res.json({
           success: true,
           pricingInfo
       });

   } catch (error) {
       console.error('API 에러:', error);
       res.status(500).json({
           success: false,
           error: error.message
       });
   }
});

export default router;