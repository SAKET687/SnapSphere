
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dytpynmiajyukcncmcrf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dHB5bm1pYWp5dWtjbmNtY3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTI4MzkxMiwiZXhwIjoyMDMwODU5OTEyfQ.ZrCMuvHXIIG8FDkk4qNvhHCP7OU-GIOTJ9SNr9Pwt0c";
export default createClient(supabaseUrl, supabaseKey);

