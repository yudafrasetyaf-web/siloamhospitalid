import express from 'express';
import {
  getAboutUs,
  getCareers,
  getQuickLinks,
  getFooter,
  getHeroContent
} from '../controllers/contentController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Static pages and navigation content
 */

/**
 * @swagger
 * /api/v1/content/about-us:
 *   get:
 *     summary: Get About Us page content
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: About Us page data
 */
router.get('/about-us', getAboutUs);

/**
 * @swagger
 * /api/v1/content/careers:
 *   get:
 *     summary: Get Careers page content with job listings
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Careers page data
 */
router.get('/careers', getCareers);

/**
 * @swagger
 * /api/v1/content/quick-links:
 *   get:
 *     summary: Get navigation quick links
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Array of quick links
 */
router.get('/quick-links', getQuickLinks);

/**
 * @swagger
 * /api/v1/content/footer:
 *   get:
 *     summary: Get footer content
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Footer data with links, contact info, and social media
 */
router.get('/footer', getFooter);

/**
 * @swagger
 * /api/v1/content/hero:
 *   get:
 *     summary: Get homepage hero/banner content
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Hero section data
 */
router.get('/hero', getHeroContent);

export default router;
