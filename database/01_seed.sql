
WITH
account_ids AS (
  INSERT INTO account (email, password, role)
  VALUES ('cto@technology-radar.ch', crypt('cto-password', gen_salt('bf', 5)), 'CTO'),
         ('tech-lead@technology-radar.ch', crypt('tech-lead-password', gen_salt('bf', 5)), 'Tech-Lead'),
         ('user@technology-radar.ch', crypt('user-password', gen_salt('bf', 5)), 'User')
  RETURNING id, email
),
tech AS (
  INSERT INTO technology (name, category, ring, description, ring_reason, created_by, created_at, published, published_at)
  SELECT 'Kubernetes', 'Platforms'::category, 'Adopt'::ring, 'Cluster', 'Because Adopt', account_ids.id, NOW(), false, NULL
  FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
  UNION ALL
  SELECT 'AgroCD', 'Tools'::category, 'Trial'::ring, 'Kubernetes Cluster', 'Because Trial', account_ids.id, NOW(), true, NOW()
  FROM account_ids WHERE email = 'cto@technology-radar.ch'
  UNION ALL
  SELECT 'GitOps', 'Techniques'::category, 'Assess'::ring, 'Technique for deploying Applications', 'Because Assess', account_ids.id, NOW(), false, NULL
  FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
  UNION ALL
  SELECT 'Web components for SSR', 'Techniques'::category, 'Hold'::ring, 'Server Side Rendering', NULL, account_ids.id, NOW(), false, NULL
  FROM account_ids WHERE email = 'tech-lead@technology-radar.ch'
  UNION ALL
  SELECT 'Design Systems', 'Techniques'::category, 'Adopt'::ring,
  'As application development becomes increasingly dynamic and complex,
  its a challenge to deliver accessible and usable products with consistent style.
  This is particularly true in larger organizations with multiple teams
  working on different products.', 'Because Adopt', account_ids.id, NOW(), true, NOW()
  FROM account_ids WHERE email = 'cto@technology-radar.ch'
  RETURNING id, name, ring, ring_reason, created_by
)
INSERT INTO ring_history (technology_id, ring, ring_reason, changed_by, changed_at)
SELECT tech.id, tech.ring, tech.ring_reason, tech.created_by, NOW()
FROM tech WHERE ring_reason IS NOT NULL
