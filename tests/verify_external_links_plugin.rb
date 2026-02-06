# This script verifies the logic used in _plugins/external_links.rb
# It simulates the plugin's behavior without needing the full Jekyll environment.

def process_content(content)
  # Logic matched to _plugins/external_links.rb
  content.gsub!(/<a\s+[^>]*>/i) do |match|
    # Check for target="_blank"
    is_blank = match =~ /target=(["'])_blank\1/i

    # Check for external link (http://, https://, or //)
    is_external = match =~ /href=(["'])(?:(?:https?:)?\/\/)/i

    if is_blank && is_external
      if match.include?('rel=')
        # If rel exists, check if it already has noopener noreferrer
        if match.include?('noopener') && match.include?('noreferrer')
          match
        else
          # Append to existing rel attribute
          match.sub(/rel=(["'])(.*?)\1/) do |rel_match|
             quote = $1
             val = $2
             # Append and deduplicate
             new_val = (val.split + ["noopener", "noreferrer"]).uniq.join(' ')
             "rel=#{quote}#{new_val}#{quote}"
          end
        end
      else
        # Add new rel attribute
        match.sub('>', ' rel="noopener noreferrer">')
      end
    else
      match
    end
  end
  content
end

def test_case(name, input, expected_match)
  puts "Testing: #{name}"
  result = process_content(input.dup)
  passed = false

  if expected_match
    if result.include?('noopener noreferrer')
      passed = true
    end
  else
    if !result.include?('noopener noreferrer')
      passed = true
    end
  end

  if passed
    puts "✅ Passed"
  else
    puts "❌ Failed"
    puts "   Input:    #{input}"
    puts "   Expected: #{expected_match ? 'Match' : 'No match'}"
    puts "   Result:   #{result}"
    exit(1) # Fail the script if any test fails
  end
  puts "------------------------------------------------"
end

puts "Running External Links Plugin Verification..."
puts "------------------------------------------------"

# Test Cases
test_case("Standard Case", '<a href="https://example.com" target="_blank">Link</a>', true)
test_case("Swapped Attributes", '<a target="_blank" href="https://example.com">Link</a>', true)
test_case("Protocol Relative", '<a href="//example.com" target="_blank">Link</a>', true)
test_case("With existing rel", '<a href="https://example.com" target="_blank" rel="nofollow">Link</a>', true)
test_case("Internal Link", '<a href="/about" target="_blank">Link</a>', false)
test_case("Internal Absolute (treated as external)", '<a href="http://mysite.com" target="_blank">Link</a>', true)
test_case("No blank", '<a href="https://example.com">Link</a>', false)
test_case("Existing rel partial", '<a href="https://example.com" target="_blank" rel="noopener">Link</a>', true)
