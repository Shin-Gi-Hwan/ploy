package com.prod.ploy.security;

import com.prod.ploy.model.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

/**
 * Wraps a Member entity as an OAuth2User so that Spring Security can handle it
 * uniformly, and OAuthSuccessHandler can retrieve the Member after authentication.
 */
public class OAuthMemberPrincipal implements OAuth2User {

    private final Member member;
    private final Map<String, Object> attributes;

    public OAuthMemberPrincipal(Member member, Map<String, Object> attributes) {
        this.member     = member;
        this.attributes = attributes;
    }

    public Member getMember() { return member; }

    @Override public Map<String, Object> getAttributes() { return attributes; }
    @Override public String getName()                     { return member.getEmail(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return member.getAuthorities();
    }
}
