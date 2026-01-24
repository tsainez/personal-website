
file_path = '_plugins/external_links.rb'
content = File.read(file_path)

# Extract the regex from the gsub! call
# Looking for: doc.output.gsub!(/REGEX/) do |match|
regex_match = content.match(/doc\.output\.gsub!\(\/(.*?)\/\) do \|match\|/)

if regex_match
  regex_str = regex_match[1]
  puts "Extracted Regex String: #{regex_str}"

  # Convert string back to Regexp object
  # We need to handle escaped characters if necessary, but basic string interpolation should work for testing
  # However, ruby string to regex might be tricky if there are complex escapes.
  # Let's try to construct it.

  begin
    regex = Regexp.new(regex_str)
    puts "Compiled Regex: #{regex.inspect}"
  rescue => e
    puts "Failed to compile regex: #{e.message}"
    exit(1)
  end

  test_cases = [
    { input: '<a href="https://example.com" target="_blank">Link</a>', should_match: true },
    { input: '<a href="http://example.com" target="_blank">Link</a>', should_match: true },
    { input: '<a href="//example.com" target="_blank">Link</a>', should_match: true },
    { input: '<a href="/local" target="_blank">Link</a>', should_match: false }
  ]

  failed = false
  test_cases.each do |tc|
    if tc[:input].match(regex)
      if tc[:should_match]
        puts "PASS: Matched #{tc[:input]}"
      else
        puts "FAIL: Should NOT match #{tc[:input]}"
        failed = true
      end
    else
      if tc[:should_match]
        puts "FAIL: Should match #{tc[:input]}"
        failed = true
      else
        puts "PASS: Did not match #{tc[:input]}"
      end
    end
  end

  if failed
    puts "Verification FAILED"
    exit(1)
  else
    puts "Verification PASSED"
    exit(0)
  end

else
  puts "Could not find regex in #{file_path}"
  exit(1)
end
