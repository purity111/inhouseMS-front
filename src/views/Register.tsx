'use client'

import { db } from '@configs/firebaseConfig'
import { collection, getDoc, doc } from 'firebase/firestore'
// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'


// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'
// import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import { createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from 'firebase/auth';
import { auth } from '@/configs/firebaseConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

const RegisterV2 = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  
  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  // const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const { settings } = useSettings()

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState('');
  const [loading ,setLoading] = useState(false);

  const [userNameVerificationError, setUserNameVerificationError] = useState<boolean>(false);
  const [emailVerificationError, setEmailVerificationError] = useState<boolean>(false);
  const [passwordVerificationError, setPasswordVerificationError] = useState<boolean>(false);
  const [teamVerificationError, setTeamVerificationError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const docRef = doc(db, 'static', 'team-category');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const teamCategory = docSnap.data();
        console.log(teamCategory);
        setTeams(teamCategory?.main || []);
      }
    })();
  }, [])

  const handleTeamChange = (e: SelectChangeEvent) => setTeam(e.target.value)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const verificationOfForm = (data: { username: string, email: string, password: string, teamId: string }): boolean =>  {
    console.log(data);
    const { username, email, password, teamId } = data;
    let res = true;
    if (!username) {
      setUserNameVerificationError(true);
      res = false;
    }
    if (!email) {
      setEmailVerificationError(true);
      res = false;
    }
    if (!password) {
      setPasswordVerificationError(true);
      res = false;
    }
    if (!teamId) {
      setTeamVerificationError(true);
      res = false;
    }
    return res;
  }

  const onRegisterHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const username: string = e.currentTarget.username.value;
    const email: string = e.currentTarget.email.value;
    const password: string = e.currentTarget.password.value;
    const teamId: string = e.currentTarget.team.value

    if (!verificationOfForm({ username, email, password, teamId })) {
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((credential: UserCredential) => {
        sendEmailVerification(credential.user);
        setLoading(false);
        window.location.href='/login'
      }).catch(() => {
        setLoading(false);
      })
  }
  console.log(teamVerificationError)
  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='plb-12 pis-12'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[500px] max-is-full bs-auto'
          />
        </div>
        <Illustrations
          image1={{ src: '/images/illustrations/objects/tree-2.png' }}
          image2={null}
          maskImg={{ src: authBackground }}
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          // href={getLocalizedUrl('/', locale as Locale)}
          href=""
          className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>

        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
          <div>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography className='mbe-1'>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={onRegisterHandle} className='flex flex-col gap-5'>
            <div>
              <TextField autoFocus fullWidth label='Username' name='username' />
              { userNameVerificationError && <div className='text-red-500 text-sm'>User Name field is required to be filled.</div> }
            </div>
            <div>
              <TextField fullWidth label='Email' name='email' />
              { emailVerificationError && <div className='text-red-500 text-sm'>Email field is required to be filled.</div> }
            </div>
            <div>
              <TextField name='password'
                fullWidth
                label='Password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              { passwordVerificationError && <div className='text-red-500 text-sm'>Password field is required to be filled.</div> }
            </div>
            <div>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-label">Team</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="team"
                  value={team}
                  label="Team"
                  disabled={teams.length === 0}
                  onChange={handleTeamChange}
                >
                  <MenuItem value=''>Please Select Team</MenuItem>
                  {teams.map((team: { id: string, title: string }) => <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>)}
                </Select>
              </FormControl>  
              { teamVerificationError && <div className='text-red-500 text-sm'>Team is required to be selected.</div> }
            </div>
            <div className='flex justify-between items-center gap-3'>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <>
                    <span>I agree to </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </Link>
                  </>
                }
              />
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Sign Up
              {loading && (
                <CircularProgress 
                  size={24} 
                  style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }} 
                />
              )}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href='/login' color='primary'>
                Sign in instead
              </Typography>
            </div>
            <Divider className='gap-3'>or</Divider>
            <div className='flex justify-center items-center gap-2'>
              <IconButton size='small'>
                <i className='ri-facebook-fill text-facebook' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-twitter-fill text-twitter' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-github-fill text-github' />
              </IconButton>
              <IconButton size='small'>
                <i className='ri-google-fill text-googlePlus' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterV2
