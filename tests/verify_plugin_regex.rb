# Replicating the logic from _plugins/external_links.rb
def check_link(html, regex)
  html.gsub(regex) do |match|
    if match.include?('rel=')
      if match.include?('noopener') && match.include?('noreferrer')
        match
      else
        match.sub(/rel=(["'])(.*?)\1/, 'rel=\1\2 noopener noreferrer\1')
      end
    else
      match.sub('>', ' rel="noopener noreferrer">')
    end
  end
end

# Extract regex from the actual file
plugin_content = File.read('_plugins/external_links.rb')
# Match the regex literal inside the gsub call
regex_match = plugin_content.match(/doc\.output\.gsub!\((.*?)\) do/)

if regex_match
  regex_string = regex_match[1]
  # Convert string representation of regex back to Regexp object
  # The string is like /<a...>/
  # We need to strip the leading/trailing slashes
  regex_content = regex_string.strip
  if regex_content.start_with?('/') && regex_content.end_with?('/')
     regex_content = regex_content[1..-2]
  end
  current_regex = Regexp.new(regex_content)
  puts "Extracted Regex: #{current_regex.inspect}"
else
  puts "ERROR: Could not extract regex from file."
  exit 1
end

link_http = '<a href="https://example.com" target="_blank">Link</a>'
link_proto_relative = '<a href="//example.com" target="_blank">Link</a>'

puts "\n--- Testing Extracted Regex ---"
result_http = check_link(link_http.dup, current_regex)
puts "HTTP Link: #{result_http}"
if result_http.include?('noopener')
  puts "PASS: HTTP link secured."
else
  puts "FAIL: HTTP link NOT secured."
end

result_proto = check_link(link_proto_relative.dup, current_regex)
puts "Proto-Relative Link: #{result_proto}"
if result_proto.include?('noopener')
  puts "PASS: Proto-Relative link secured."
else
  puts "FAIL: Proto-Relative link NOT secured."
end
