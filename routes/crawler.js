// crawler.js
const express = require('express');
const router = express.Router();
const playwright = require('playwright');


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
 
        // 모든 정보 한번에 가져오기
        const siteInfo = await page.evaluate(() => {
            // 1. 로고 찾기
            let logo = null;
            const svgLogo = document.querySelector('svg[class*="logo"]');
            if (svgLogo) {
                logo = { type: 'svg', content: svgLogo.outerHTML };
            } else {
                const imgLogo = document.querySelector('img[class*="logo"], img[alt*="logo"], img[src*="logo"]');
                if (imgLogo) {
                    logo = { type: 'image', url: imgLogo.src };
                } else {
                    const divLogo = document.querySelector('div[class*="logo"]');
                    if (divLogo) {
                        const style = window.getComputedStyle(divLogo);
                        const bgImage = style.backgroundImage;
                        if (bgImage !== 'none') {
                            logo = { type: 'image', url: bgImage.replace(/url\(['"](.+)['"]\)/, '$1') };
                        }
                    } else {
                        const metaLogo = document.querySelector('meta[property="og:image"]');
                        if (metaLogo) {
                            logo = { type: 'image', url: metaLogo.content };
                        }
                    }
                }
            }
 
            // 2. 이름/제목 찾기
            const title = document.querySelector('meta[property="og:title"]')?.content
                || document.querySelector('title')?.textContent
                || document.querySelector('h1')?.textContent
                || '';
 
            // 3. 설명 찾기
            const description = document.querySelector('meta[property="og:description"]')?.content
                || document.querySelector('meta[name="description"]')?.content
                || '';
 
            // 4. favicon 찾기
            const favicon = document.querySelector('link[rel="icon"]')?.href
                || document.querySelector('link[rel="shortcut icon"]')?.href
                || '/favicon.ico';
 
               // 5. 소셜 미디어 링크 찾기
            const socialLinks = {
                twitter: document.querySelector('a[href*="twitter.com"]')?.href || null,
                linkedin: document.querySelector('a[href*="linkedin.com"]')?.href || null,
                facebook: document.querySelector('a[href*="facebook.com"]')?.href || null,
                instagram: document.querySelector('a[href*="instagram.com"]')?.href || null
            };

            // 6. 연락처 정보 찾기
            const contact = {
                email: document.querySelector('a[href^="mailto:"]')?.href?.replace('mailto:', '') || null,
                phone: document.querySelector('a[href^="tel:"]')?.href?.replace('tel:', '') || null
            };

            // 7. 회사 이름 찾기
            let company = null;
            // copyright에서 찾기
            const copyright = document.querySelector('footer, [class*="footer"]')
                ?.textContent.match(/©\s*\d{4}\s*([^.|\n]+)/)?.[1];
            if (copyright) {
                company = copyright.trim();
            } else {
                // Schema에서 찾기
                const schema = document.querySelector('script[type="application/ld+json"]');
                if (schema) {
                    try {
                        const data = JSON.parse(schema.textContent);
                        company = data.organization?.name || data.publisher?.name;
                    } catch (e) {}
                }
                // meta 태그에서 찾기
                if (!company) {
                    company = document.querySelector('meta[property="og:site_name"]')?.content;
                }
            }

            return {
                logo,
                title: title.trim(),
                description: description.trim(),
                favicon,
                socialLinks,
                contact,
                company: company?.trim() || null
            };
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
        
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        await page.waitForTimeout(2000);

        const pricingInfo = await page.evaluate(() => {
            const plans = [];
            
            // 가격 관련 요소들 찾기
            const priceElements = document.querySelectorAll('[class*="price"], [class*="plan"], [class*="tier"]');
            
            priceElements.forEach(card => {
                // 이름 찾기
                const nameElement = card.querySelector('[class*="title"], [class*="name"], h2, h3');
                const name = nameElement?.textContent.trim();
                
                if (!name) return;

                // 가격 찾기 - 단순화된 접근
                let price = null;
                const priceElement = card.querySelector('[class*="price"]') || card;
                const text = priceElement.textContent;

                if (text.includes('₩') || text.includes('$') || text.includes('원')) {
                    const priceMatch = text.match(/((₩|\$)\s*[\d,]+)|(\d{1,3}(,\d{3})*원)/);
                    price = priceMatch ? priceMatch[0].trim() : 'Contact Us';
                } else if (text.toLowerCase().includes('free') || text.includes('무료')) {
                    price = 'Free';
                } else if (text.includes('문의') || text.toLowerCase().includes('contact')) {
                    price = 'Contact Us';
                }

                // 기간 찾기 (월/연 단위)
                let period = null;
                if (text.includes('월') || text.includes('mo') || text.includes('month')) {
                    period = 'month';
                } else if (text.includes('년') || text.includes('年') || text.includes('year')) {
                    period = 'year';
                } else {
                    period = 'month'; // 기본값
                }

                // 기능 목록 찾기
                const features = [];
                const featureList = card.querySelectorAll('ul li');
                featureList.forEach(feature => {
                    const featureText = feature.textContent.trim();
                    if (featureText) {
                        features.push(featureText);
                    }
                });

                plans.push({
                    name,
                    price: price || 'Contact Us',
                    period,
                    features,
                    isContactRequired: price === 'Contact Us'
                });
            });

            return {
                plans,
                currency: plans.find(p => p.price?.includes('₩') || p.price?.includes('$'))?.price?.includes('₩') ? '₩' : '$',
                hasFreeplan: plans.some(p => p.price === 'Free'),
                foundAtUrl: window.location.href
            };
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

        // URL 끝의 슬래시 제거 후 /pricing 추가
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

module.exports = router;