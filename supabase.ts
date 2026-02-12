
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://naduwlbzmvpmfbviolbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZHV3bGJ6bXZwbWZidmlvbGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTI0NjAsImV4cCI6MjA4NjQ2ODQ2MH0.RjBmcNtlYjpb6o-d_OB2XElSTj6d-J1FCIyway7PkkA';

export const supabase = createClient(supabaseUrl, supabaseKey);
