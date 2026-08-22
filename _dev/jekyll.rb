#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Local-preview launcher: applies Ruby 4 compatibility patches, then runs Jekyll.
# Use ./serve.sh rather than calling this directly.
#
# The github-pages gem pins a 2021-era stack (Jekyll 3.9, Liquid 4.0.3,
# pathutil 0.16.2) that predates two breaking Ruby changes:
#
#   1. Ruby 3.2 removed the taint API (Object#tainted?, #taint, #untaint).
#   2. Ruby 3.0 stopped auto-converting a trailing Hash into keyword arguments.
#
# These patches cannot live in _plugins/: github-pages forces Jekyll into safe
# mode to emulate GitHub's builder, and safe mode never loads _plugins/. They
# also cannot be preloaded via RUBYOPT, because the gems are not on the load
# path until Bundler has set it up. Hence this launcher.
#
# Nothing here reaches the deployed site -- GitHub builds from the committed
# sources with its own Ruby.

require "bundler/setup"

# (1) Taint API. Ruby's taint system is gone, so no-ops are faithful.
if Gem::Version.new(RUBY_VERSION) >= Gem::Version.new("3.2")
  class Object
    def tainted? = false
    def taint   = self
    def untaint = self
  end
end

# (2) Hash-to-keywords. pathutil passes its options Hash positionally, where
# File.read now reads it as the `length` argument and raises TypeError.
require "pathutil"
class Pathutil
  def read(*args, **kwd)
    kwd[:encoding] ||= encoding
    out = File.read(self, *args, **kwd)
    normalize[:read] ? out.encode(:universal_newline => true) : out
  end

  def binread(*args, **kwd)
    out = File.binread(self, *args, **kwd)
    normalize[:read] ? out.encode(:universal_newline => true) : out
  end
end

load Gem.bin_path("jekyll", "jekyll")
