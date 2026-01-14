## 1. Database Schema

- [ ] 1.1 Add `ProductAffinity` model (sourceProductId, targetProductId, type, priority, conditions JSON)
- [ ] 1.2 Add `AffinityType` enum (CROSS_SELL, UPSELL, ACCESSORY, REQUIRED, FREQUENTLY_BOUGHT)
- [ ] 1.3 Add `Questionnaire` model (id, name, description, isActive)
- [ ] 1.4 Add `Question` model (questionnaireId, text, type, options JSON, order, branchLogic JSON)
- [ ] 1.5 Add `QuestionProductMapping` model (questionId, answerValue, productId, score)
- [ ] 1.6 Add `RecommendationLog` model (quoteId, productId, source, action, timestamp)
- [ ] 1.7 Add `embedding` vector field to Product (nullable, for future AI)
- [ ] 1.8 Run migration

## 2. Recommendation Engine

- [ ] 2.1 Create `server/services/recommendationEngine.ts`
- [ ] 2.2 Implement `getRecommendations(quoteId)` - fetch based on quote products
- [ ] 2.3 Implement affinity rule evaluation
- [ ] 2.4 Implement scoring and priority sorting
- [ ] 2.5 Implement `logRecommendationAction(quoteId, productId, action)`

## 3. Guided Selling Engine

- [ ] 3.1 Create `server/services/guidedSellingEngine.ts`
- [ ] 3.2 Implement questionnaire flow logic
- [ ] 3.3 Implement answer → product mapping
- [ ] 3.4 Implement product scoring based on answers

## 4. Backend API

- [ ] 4.1 Create `GET /api/recommendations/:quoteId` - Get recommendations for quote
- [ ] 4.2 Create `POST /api/recommendations/log` - Log recommendation action
- [ ] 4.3 Create `GET /api/affinities` - List affinity rules
- [ ] 4.4 Create `POST /api/affinities` - Create affinity rule
- [ ] 4.5 Create `PUT /api/affinities/:id` - Update affinity rule
- [ ] 4.6 Create `DELETE /api/affinities/:id` - Delete affinity rule
- [ ] 4.7 Create questionnaire CRUD endpoints

## 5. Frontend Components

- [ ] 5.1 Create `Recommendations.vue` panel component
- [ ] 5.2 Create `RecommendationCard.vue` for individual recommendations
- [ ] 5.3 Create `GuidedSellingWizard.vue` questionnaire wizard
- [ ] 5.4 Add recommendations panel to quote editor
- [ ] 5.5 Add "Start Guided Selling" button to quote editor

## 6. Management UI

- [ ] 6.1 Create affinity rules management page
- [ ] 6.2 Create questionnaire builder page
- [ ] 6.3 Add recommendation analytics dashboard (acceptance rate)

## 7. Seed Data

- [ ] 7.1 Add sample affinity rules (monitor + stand, laptop + accessories)
- [ ] 7.2 Add sample questionnaire for laptop selection
