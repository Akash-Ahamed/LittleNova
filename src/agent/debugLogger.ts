const DEBUG_AGENT =
  typeof __DEV__ !== 'undefined'
    ? __DEV__
    : process.env.NODE_ENV !== 'test';

export function logAgentStep(label: string, data: unknown) {
  if (!DEBUG_AGENT) return;

  console.log(`\n🧠 [AI AGENT] ${label}`);
  console.log(JSON.stringify(data, null, 2));
}