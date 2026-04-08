import OpenAI from 'openai';

type ParsedJobDescription = {
  company: string;
  role: string;
  jobTitle?: string;
  job_title?: string;
  requiredSkills: string[];
  skills?: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  workArrangement?: string;
  work_arrangement?: string;
};

const createClient = (): OpenAI => {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

const fallbackParsedResponse: ParsedJobDescription = {
  company: '',
  role: '',
  requiredSkills: [],
  niceToHaveSkills: [],
  seniority: '',
  location: '',
};

const extractJson = <T>(content: string, fallback: T): T => {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);

    if (!match) {
      return fallback;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return fallback;
    }
  }
};

export const parseJobDescription = async (jd: string): Promise<ParsedJobDescription> => {
  if (!jd.trim()) {
    return fallbackParsedResponse;
  }

  try {
    const client = createClient();

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Extract job information from descriptions and return normalized structured data only as JSON.',
        },
        {
          role: 'user',
          content: jd,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    console.log('Groq parse raw response:', raw);
    const parsed = extractJson<ParsedJobDescription>(raw, fallbackParsedResponse);

    return {
      company: parsed.company ?? '',
      role: parsed.role ?? parsed.jobTitle ?? parsed.job_title ?? '',
      requiredSkills: Array.isArray(parsed.requiredSkills)
        ? parsed.requiredSkills
        : Array.isArray(parsed.skills)
          ? parsed.skills
          : [],
      niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
      seniority: parsed.seniority ?? '',
      location: parsed.location ?? '',
    };
  } catch (error) {
    console.error('Groq job parsing failed:', error);
    return fallbackParsedResponse;
  }
};

export const generateResumeSuggestions = async (
  role: string,
  requiredSkills: string[],
): Promise<string[]> => {
  if (!role.trim() && requiredSkills.length === 0) {
    return [];
  }

  try {
    const client = createClient();

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'Generate concise, impact-focused resume bullet suggestions tailored to the role and required skills. Return JSON only.',
        },
        {
          role: 'user',
          content: `Role: ${role}\nRequired Skills: ${requiredSkills.join(', ')}`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? '{}';
    console.log('Groq suggestions raw response:', raw);
    const parsed = extractJson<{
      suggestions?: string[];
      bulletPoints?: Array<{ description?: string }>;
    }>(raw, {});

    if (Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.slice(0, 5);
    }

    if (Array.isArray(parsed.bulletPoints)) {
      return parsed.bulletPoints
        .map((item) => item.description?.trim())
        .filter((description): description is string => Boolean(description))
        .slice(0, 5);
    }

    return [];
  } catch (error) {
    console.error('Groq suggestions generation failed:', error);
    return [];
  }
};
