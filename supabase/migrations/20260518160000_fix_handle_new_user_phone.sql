-- Create migration to fix handle_new_user trigger populating the phone column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.user_role;
  v_phone text;
BEGIN
  -- Extract user role from metadata, default to customer
  v_role := COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role);

  -- Extract phone number from metadata, direct phone field, or split the email prefix as fallback
  v_phone := COALESCE(
    new.raw_user_meta_data->>'phone',
    new.phone,
    SPLIT_PART(new.email, '@', 1)
  );

  -- Insert profile with complete fields
  INSERT INTO public.users (id, full_name, role, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'), 
    v_role,
    v_phone
  );
  
  -- Create rider profile automatically if role is rider
  IF v_role = 'rider' THEN
    INSERT INTO public.rider_profiles (id, is_online)
    VALUES (new.id, false);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
