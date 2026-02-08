
# Plan: AI Features Health Check and Agent Memory/Awareness System

## Part 1: AI Features Health Check and Fixes

After thorough code review, I've identified the following issues with the current AI features:

### Issue 1: `chat/index.ts` uses `getClaims()` while other functions use `getUser()`
The `chat` edge function uses `supabase.auth.getClaims(token)` for authentication, which is a newer API method. While it should work with current Supabase versions, it creates inconsistency with the other edge functions (`workflow-builder`, `rag-chat`, `run-workflow`) that all use `supabase.auth.getUser()`. For reliability and consistency, the `chat` function should be aligned to use `getUser()`.

### Issue 2: `rag-chat` uses service role key without user-level auth
The `rag-chat` function creates a Supabase client with `SUPABASE_SERVICE_ROLE_KEY` and doesn't validate the incoming JWT token at all. This is a functional AND security issue -- any request could invoke this function without authentication.

### Issue 3: Edge functions not registered in `config.toml`
The `supabase/config.toml` only registers `manage-api-keys`. The other functions (`chat`, `workflow-builder`, `rag-chat`, `rag-retrieve`, `run-workflow`, `process-document`) are not listed. While Lovable Cloud auto-deploys edge functions, missing config entries can cause JWT verification issues. Functions that need to accept user JWTs should be explicitly configured.

### Fixes to apply:
1. **`chat/index.ts`**: Replace `getClaims()` with `getUser()` for consistency and reliability
2. **`rag-chat/index.ts`**: Add JWT authentication validation before processing requests
3. **`config.toml`**: Add all edge function entries with appropriate `verify_jwt` settings

---

## Part 2: Agent Memory and Awareness System

This is a significant feature addition that builds upon the existing `agent_memory` table and the memory functions already partially implemented in `rag-chat/index.ts`.

### Current State
- An `agent_memory` table already exists with fields: `user_id`, `agent_id`, `workspace_id`, `memory_type`, `memory_key`, `memory_value`, `confidence`, `importance`, `last_accessed`, `access_count`, `source_conversation_id`
- `rag-chat` already has `retrieveAgentMemory()` and `updateAgentMemory()` functions
- `rag-chat` has `extractMemoryFromConversation()` for learning from conversations
- The system already passes `enable_memory` flag but memory is not exposed in the UI

### New Architecture

```
Agent Configuration
     |
     |-- Memory Settings (NEW UI section)
     |     |-- Short-term Memory (Context Window)
     |     |-- Long-term Memory (Vector DB archival)
     |     |-- Memory Retention Policy
     |
     |-- Awareness Settings (NEW UI section)
           |-- Self-Role Awareness (boundary definition)
           |-- State Awareness (status monitor)
           |-- Proactive Reasoning (chain of verification)
           |-- Awareness Level (1-5 slider)
```

### Database Changes

**New columns on `ai_profiles` table:**
- `memory_settings` (JSONB): Configuration for memory behavior
- `awareness_settings` (JSONB): Configuration for awareness behavior

**New table: `agent_experience_archive`**
Stores successful task completions as semantic archives for long-term learning.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| agent_id | UUID | FK to ai_profiles |
| workspace_id | UUID | FK to workspaces |
| task_summary | TEXT | What was accomplished |
| context_type | TEXT | Type of task (analysis, review, synthesis) |
| success_score | REAL | How successful the outcome was |
| learned_patterns | JSONB | Patterns extracted from the experience |
| created_at | TIMESTAMPTZ | When archived |

### Frontend Changes

**1. Agent Configuration Page (`AgentConfiguration.tsx`)**
Add two new cards in a new "Intelligence" tab:

**Memory Settings Card:**
- Toggle: Enable Short-term Memory (context window)
- Slider: Context Window Size (5-50 exchanges, default 10)
- Toggle: Enable Long-term Memory (experience archival)
- Select: Memory Retention Policy (keep_all / keep_successful / keep_30_days)
- Toggle: Learn from User Preferences
- Read-only section: Memory Stats (total memories, last accessed)

**Awareness Settings Card:**
- Slider: Awareness Level (1-5, controls autonomy)
- Toggle: Self-Role Awareness (boundary enforcement)
- Textarea: Role Boundaries (what the agent should NOT do)
- Toggle: State Awareness (reads system/project state before responding)
- Select: State Context Source (project_status / workflow_status / custom)
- Toggle: Proactive Reasoning (Chain of Verification before output)
- Toggle: Feedback Learning (adjust behavior based on user corrections)

**2. Multi-Agent Canvas (`MultiAgentCanvas.tsx`)**
- Add memory/awareness indicators on agent nodes (small icons showing enabled features)
- In AgentNodeConfig sheet, add a "Memory & Awareness" section showing which features are enabled

**3. Edge Function Changes (`rag-chat/index.ts`)**

Enhance the main handler to:
- Read `memory_settings` and `awareness_settings` from the agent config
- Apply context window limiting based on short-term memory settings
- Inject agent boundary constraints into the system prompt (self-role awareness)
- Add state context injection before response generation
- Implement Chain of Verification step before final answer
- Archive successful interactions to `agent_experience_archive`

The system prompt will be enhanced with awareness directives:

```
## SELF-ROLE AWARENESS
Your role boundaries: [from config]
If a request falls outside your expertise, respond with:
"This falls outside my area of expertise. I recommend consulting [suggested agent]."

## STATE AWARENESS  
Current system state: [injected from status monitor]
Adjust your response urgency and detail based on the current state.

## PROACTIVE REASONING
Before providing your answer, internally verify:
1. Does this response align with the user's stated goal?
2. Have I stayed within my role boundaries?
3. Is my confidence level sufficient to provide this answer?
```

### Implementation Steps (ordered)

1. Create database migration:
   - Add `memory_settings` and `awareness_settings` JSONB columns to `ai_profiles`
   - Create `agent_experience_archive` table with RLS policies

2. Update `AgentConfiguration.tsx`:
   - Add Memory Settings UI card
   - Add Awareness Settings UI card
   - Include new fields in form data and save logic

3. Update `rag-chat/index.ts`:
   - Add authentication validation
   - Read memory/awareness settings from agent config
   - Implement context window limiting
   - Enhance system prompt with awareness directives
   - Add Chain of Verification step
   - Implement experience archival after successful responses

4. Update `chat/index.ts`:
   - Fix authentication to use `getUser()` consistently

5. Update `config.toml`:
   - Register all edge functions

6. Update `MultiAgentCanvas.tsx`:
   - Add memory/awareness indicators on agent nodes

7. Update type definitions:
   - Add `MemorySettings` and `AwarenessSettings` interfaces to `src/types/index.ts`

### Technical Details

**New TypeScript interfaces:**

```typescript
interface MemorySettings {
  short_term_enabled: boolean;
  context_window_size: number;  // 5-50
  long_term_enabled: boolean;
  retention_policy: 'keep_all' | 'keep_successful' | 'keep_30_days';
  learn_preferences: boolean;
}

interface AwarenessSettings {
  awareness_level: number;  // 1-5
  self_role_enabled: boolean;
  role_boundaries: string | null;
  state_awareness_enabled: boolean;
  state_context_source: 'project_status' | 'workflow_status' | 'custom';
  proactive_reasoning: boolean;
  feedback_learning: boolean;
}
```

**Default values:**

```typescript
const defaultMemorySettings: MemorySettings = {
  short_term_enabled: true,
  context_window_size: 10,
  long_term_enabled: false,
  retention_policy: 'keep_successful',
  learn_preferences: true,
};

const defaultAwarenessSettings: AwarenessSettings = {
  awareness_level: 2,
  self_role_enabled: false,
  role_boundaries: null,
  state_awareness_enabled: false,
  state_context_source: 'project_status',
  proactive_reasoning: false,
  feedback_learning: false,
};
```

This plan transforms agents from simple command executors into intelligent partners that learn, remember, and reason within their defined boundaries.
