<?php

return [
    'models' => [
        [
            'id' => 'gpt-4o', 'name' => 'GPT-4o', 'provider' => 'OpenAI', 'category' => 'models.category.general',
            'context' => '128K', 'description' => 'models.demo.gpt', 'featured' => true,
        ],
        [
            'id' => 'claude-3-5-sonnet', 'name' => 'Claude 3.5 Sonnet', 'provider' => 'Anthropic', 'category' => 'models.category.coding',
            'context' => '200K', 'description' => 'models.demo.claude', 'featured' => true,
        ],
        [
            'id' => 'deepseek-chat', 'name' => 'DeepSeek Chat', 'provider' => 'DeepSeek', 'category' => 'models.category.general',
            'context' => '64K', 'description' => 'models.demo.deepseek', 'featured' => true,
        ],
        [
            'id' => 'gemini-1-5-flash', 'name' => 'Gemini 1.5 Flash', 'provider' => 'Google', 'category' => 'models.category.fast',
            'context' => '1M', 'description' => 'models.demo.gemini', 'featured' => true,
        ],
        [
            'id' => 'gpt-4o-mini', 'name' => 'GPT-4o mini', 'provider' => 'OpenAI', 'category' => 'models.category.fast',
            'context' => '128K', 'description' => 'models.demo.mini', 'featured' => false,
        ],
        [
            'id' => 'deepseek-reasoner', 'name' => 'DeepSeek Reasoner', 'provider' => 'DeepSeek', 'category' => 'models.category.reasoning',
            'context' => '64K', 'description' => 'models.demo.reasoner', 'featured' => false,
        ],
    ],
    'packages' => [
        ['name' => 'Lite', 'price' => 19000, 'credits' => '20M', 'bonus' => '5M', 'validity' => 30, 'featured' => false],
        ['name' => 'Plus', 'price' => 46000, 'credits' => '50M', 'bonus' => '15M', 'validity' => 30, 'featured' => true],
        ['name' => 'Pro', 'price' => 92000, 'credits' => '100M', 'bonus' => '35M', 'validity' => 30, 'featured' => false],
    ],
];
